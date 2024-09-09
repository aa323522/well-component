<template>
  <div class="singleWellOverviewPage w-full h-full relative">
    <div class="px-4 h-full">
      <div class="flex z-10 pt-20 pb-4 h-full gap-x-6">
        <!-- <nav-menu-base /> -->
        <div class="bg-div width22">
          <div class="back pointer" @click="goBack"><a-icon type="double-left" class="back-icon"/>返回</div>
          <single-well-info
            class="pt-4"
            :options="options"
            :options1="options1"
            :form-data="formData"
            :chunk-data="chunkData"
            @onSearch="onSearch"
          />
        </div>
        <div class="bg-div" style="width: 200px">
          <well-type-menu
            class="p-4"
            :well-name="wellName"
            :display-item="displayItem"
            @checkboxConfirm="checkboxConfirm"
            :isShow="false"
            :drillingOptions="drillingOptions"
            :loggingOptions="loggingOptions"
          />
        </div>
        <div class="flex-1 h-full bg-div">
          <temp
            :well-depth-data="wellDepthData"
            :display-list="chartDisplayList"
            :depth="depth"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navMenuBase from "../../components/navMenuBase/NavMenuBase.vue";
import SingleWellInfo from "../..//components/singleWellInfo/SingleWellInfo.vue";
import WellTypeMenu from "../..//components/wellTypeMenu/WellTypeMenu.vue";
import WellChart from "../wellChart/wellChart.vue";
import Temp from "../temp/Temp.vue";
import { maxBy, minBy, merge } from "lodash";
import {
  getWellArea,
  getWellListById,
  getWellList,
  getAllWellDataApi,
  getWellFiled
} from "../../api/homePageApi.js";

import { getColor } from "../../utils/utils";
import { drillingOptions, loggingOptions } from "../../utils/utils.js";
export default {
  name: "SingleWellOverviewPage",
  props: [],
  components: {
    WellChart,
    WellTypeMenu,
    navMenuBase,
    SingleWellInfo,
    Temp
  },
  data() {
    return {
      wellName: "",
      searchValue: "",
      chunkData: {},
      options: [],
      formData: {
        area: "", //区块选择
        searchValue: "" //井名搜索
      },
      chartData: {},
      wellDepthData: {},
      wellChartInfo: {},
      displayItem: ["ROTATE_SPEED", "WOB", "PUMP_RATE"],
      chartDisplayList: [],
      mode: this.$route.query.mode || "list",
      options: [],
      options1: [],
      depth: [],
      drillingOptions: [],
      loggingOptions: []
    };
  },
  mounted() {
    if (this.$route.query.tag == "isTag") {
      this.formData.area = Number(this.$route.query.areaId);
      this.formData.searchValue = this.$route.query.wellName;
      this.wellName = this.$route.query.wellName;
    }

    this.handleGetArea();

    const localData = localStorage.getItem("singleWellCheckboxValue");
    if (localData) {
      this.displayItem = [];
      this.defaultValue = [];
      this.defaultValue = localData.split(",");
      this.displayItem = localData.split(",");
    }

    this.handleGetWellFiled();
  },
  methods: {
    async handleGetWellFiled() {
      const filed = await getWellFiled({
        wellName: this.wellName
      });

      this.drillingOptions = filed.drill;
      this.loggingOptions = filed.logging;
    },
    //获取所属区域列表
    async handleGetArea() {
      const res = await getWellArea();
      if (res.code === "0") {
        this.options = res.data;
        if (this.$route.query.tag == "isTag") {
          this.formData.area = Number(this.$route.query.areaId);
        } else {
          this.formData.area = res.data[0].id;
        }
        this.getInitList();
      }
    },
    //通过区域id获取下拉中的井数据
    async getInitList() {
      const params = { id: this.formData.area };
      const res = await getWellListById(params);
      if (res.code === "0") {
        this.options1 = res.data;
        if (this.$route.query.tag == "isTag") {
          //列表模式路由传参过来赋值
          this.formData.searchValue = this.$route.query.wellName;
          this.wellName = this.$route.query.wellName;
        } else {
          //默认进总览页
          this.formData.searchValue = res.data[0].well_name;
          this.wellName = res.data[0].well_name;
        }
        this.getBaseWellData(); //井基本信息展示
        this.getWellData(this.wellName); //TODO 右侧图表
      }
    },
    async getBaseWellData() {
      const params = {
        id: this.formData.area,
        name: this.wellName
      };
      const res = await getWellList(params);
      if (res.code === "0") {
        this.chunkData = res.data;
      }
    },
    //切换区域块重新获取所属区域下数据
    onChange() {
      this.getInitList();
    },
    //更换下拉井名后搜索事件
    async onSearch(val) {
      const params = {
        id: val.area,
        name: val.searchValue
      };
      const res = await getWellList(params);
      if (res.code === "0") {
        this.chunkData = res.data;
      }
      this.wellName = val.searchValue;
      await this.getWellData(this.wellName);
      this.handleGetWellFiled();
    },
    onShow(val) {
      this.wellName = val.well_name;
      this.getWellData(this.wellName);
    },
    async getWellData(name) {
      const drillRes = getAllWellDataApi({ name: `${name}_DRILLING` });
      const loggingRes = getAllWellDataApi({ name: `${name}_LOGGING` });
      const allRes = await Promise.all([drillRes, loggingRes]);
      const data = merge(allRes[0].data, allRes[1].data);

      const mark = {};
      data.forEach(item => {
        const wellDepth = parseFloat(item.WELL_DEPTH);
        if (typeof wellDepth === "number") {
          Object.assign(mark, {
            [wellDepth]: {
              DATE: `${this.dayjs(item.TIME).format("HH:mm")} ${wellDepth}m`,
              horizonName: item.HORIZON_NAME,
              ...item
            }
          });
        }
      });
      this.wellDepthData = mark;
      this.wellChartInfo = data;
      this.getChartData(this.displayItem);
    },
    getChartData(value) {
      const data = {};
      value.forEach((itemKey, index) => {
        const maxItem = maxBy(this.wellChartInfo, item =>
          parseFloat(item[itemKey])
        );
        const minItem = minBy(this.wellChartInfo, item =>
          parseFloat(item[itemKey])
        );

        const chartData = [];
        const depth = [];
        this.wellChartInfo.forEach(item => {
          chartData.push(parseFloat(item[itemKey]));
          depth.push(parseFloat(item.WELL_DEPTH));
        });
        this.depth = depth;

        const foundData = [...drillingOptions, ...loggingOptions].find(
          item => item.value === itemKey
        );

        const name = foundData.label;
        const unit = foundData.unit;
        Object.assign(data, {
          [itemKey]: {
            max: maxItem[itemKey],
            min: minItem[itemKey],
            name,
            chartData,
            depth,
            unit,
            color: getColor(index % 3)
          }
        });
      });

      let result = value.map(item => {
        return [data[item]];
      });

      // value.forEach((item, index) => {
      //   if (index > 2) {
      //     result[currentIndex].push(data[item]);
      //     if (result[currentIndex].length === 3) {
      //       currentIndex++;
      //     }
      //   }
      // });

      this.chartDisplayList = result;
    },
    checkboxConfirm(value) {
      if (value.length < 3) return;
      this.displayItem = value;
      localStorage.setItem("singleWellCheckboxValue", value);
      this.getChartData(value);
    },
    goBack(){
      this.$router.go(-1)
    }
  }
};
</script>

<style lang="less">
@import "../../style/SingleWellOverviewPage.less";
</style>
