<template>
  <div class="flex-1">
    <div class="flex w-full h-full gap-x-2">
      <div class="flex-1 bg-div">
        <well-list
          :options="options"
          :chunk-data="chunkData"
          :form-data="formData"
          @onSearch="onSearch"
          :is-active="currentActive"
          @onChange="onChange"
          @show="onShow"
        />
      </div>
      <div class="bg-div width15">
        <well-type-menu
          class="p-4"
          :well-name="wellName"
          :display-item="displayItem"
          :defaultValue="defaultValue"
          @checkboxConfirm="checkboxConfirm"
          :isShow="true"
          @goDetail="goDetail"
          :drillingOptions="drillingOptions"
          :loggingOptions="loggingOptions"
        />
      </div>
      <div class="flex-1 h-full bg-div">
        <well-chart
          v-if="chartDisplayList.length >= 3"
          :well-depth-data="wellDepthData"
          :display-list="chartDisplayList"
          :depth="depth"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WellList from "../../components/wellList/WellList.vue";
import menuBase from "../../components/menuBase/MenuBase.vue";
import WellTypeMenu from "../../components/wellTypeMenu/WellTypeMenu.vue";
import WellChart from "../wellChart/wellChart.vue";
import { maxBy, minBy, merge } from "lodash";
import {
  getWellArea,
  getWellListById,
  getWellList,
  getAllWellDataApi,
  getWellFiled
} from "../../api/homePageApi.js";
import { isArray } from "lodash";

export default {
  name: "ListPage",
  props: [],
  components: {
    WellChart,
    WellTypeMenu,
    WellList,
    menuBase
  },
  data() {
    return {
      searchValue: "",
      chunkData: [],
      options: [],
      formData: {
        area: "", //区块选择
        searchValue: "" //搜索值
      },
      chartData: {},
      wellDepthData: {},
      wellChartInfo: {},
      displayItem: ["ROTATE_SPEED", "WOB", "PUMP_RATE"],
      chartDisplayList: [],
      depth: [],
      wellName: "",
      wellId: "",
      currentActive: 0,
      defaultValue: [],
      drillingOptions: [],
      loggingOptions: []
    };
  },
  watch: {
    drillingOptions: {
      handler(newVal) {
        const checkboxValue = localStorage.getItem("checkboxValue");
        if (checkboxValue) {
          this.defaultValue = checkboxValue.split(",");
          this.displayItem = checkboxValue.split(",");
        }
      },
      deep: true,
      immediate: true
    },
    loggingOptions: {
      handler(newVal) {
        const checkboxValue = localStorage.getItem("checkboxValue");
        if (checkboxValue) {
          this.defaultValue = checkboxValue.split(",");
          this.displayItem = checkboxValue.split(",");
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getArea();
      if (localStorage.getItem("checkboxValue")) {
        this.displayItem = [];
        this.defaultValue = [];
        this.defaultValue = localStorage.getItem("checkboxValue").split(",");
        this.displayItem = localStorage.getItem("checkboxValue").split(",");
      }
    },
    async getArea() {
      const res = await getWellArea();

      if (res.code === "0") {
        this.options = res.data;
        if (res.data) {
          this.formData.area = res.data[0].id;
          this.getInitList();
        }
      }
    },
    async getInitList() {
      const params = { id: this.formData.area };
      const res = await getWellListById(params);
      if (res.code === "0") {
        this.chunkData = res.data;
        this.wellName = res.data[0].well_name;
        this.wellId = res.data[0].id;
        await this.handleGetWellFiled();
        this.getWellData(this.wellName);
      }
    },
    async handleGetWellFiled() {
      const filed = await getWellFiled({
        wellName: this.wellName
      });

      this.drillingOptions = filed.drill;
      this.loggingOptions = filed.logging;
    },
    onChange() {
      this.formData.searchValue = "";
      this.getInitList();
    },
    async onSearch(val) {
      if (!val.searchValue) {
        this.getArea();
        this.currentActive = 0;
        return;
      }
      const params = {
        id: val.area,
        name: val.searchValue
      };
      const res = await getWellList(params);
      if (res.code === "0") {
        if (res.data == null || res.data == undefined) this.chunkData = [];
        this.chunkData = isArray(res.data) ? res.data : [res.data];
      }
      this.currentActive = 0;
    },
    async onShow(val, index) {
      this.wellName = val.well_name;
      this.wellId = val.id;
      this.currentActive = index;
      this.handleGetWellFiled();
      this.getWellData(this.wellName);
    },
    async getWellData(name) {
      const drillRes = getAllWellDataApi({ name: `${name}_DRILLING` });
      const loggingRes = getAllWellDataApi({ name: `${name}_LOGGING` });
      const allRes = await Promise.all([drillRes, loggingRes]);
      const data = merge(allRes[0].data, allRes[1].data);

      const mark = {};
      let newArr = [];
      newArr = data.filter(item => item.WELL_DEPTH !== null);
      newArr.forEach(item => {
        const wellDepth = parseFloat(item.WELL_DEPTH);
        if (typeof wellDepth === "number") {
          Object.assign(mark, {
            [wellDepth]: {
              DATE: `${this.dayjs(item.TIME).format("HH:mm")} ${wellDepth}m`,
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
      value.forEach(itemKey => {
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

        const foundData = [
          ...(isArray(this.drillingOptions) ? this.drillingOptions : []),
          ...(isArray(this.loggingOptions) ? this.loggingOptions : [])
        ].find(item => item.value === itemKey);

        if (!foundData) return;
        const name = foundData.label;
        const unit = foundData.unit ? foundData.unit : "";

        Object.assign(data, {
          [itemKey]: {
            max: maxItem[itemKey],
            min: minItem[itemKey],
            name,
            unit,
            chartData
          }
        });
      });

      let result = [];
      if (data[value[0]]) result.push([data[value[0]]]);
      if (data[value[1]]) result.push([data[value[1]]]);
      if (data[value[2]]) result.push([data[value[2]]]);

      let currentIndex = 0;
      value.forEach((item, index) => {
        if (index > 2) {
          result[currentIndex].push(data[item]);
          if (result[currentIndex].length === 3) {
            currentIndex++;
          }
        }
      });

      this.chartDisplayList = result;
    },
    checkboxConfirm(value) {
      if (value.length < 3) return;
      this.displayItem = value;
      localStorage.setItem("checkboxValue", value);
      this.getChartData(value);
    },
    goDetail() {
      this.$router.push({
        path: "/SingleWellOverviewPage",
        query: {
          wellName: this.wellName,
          wellId: this.wellId,
          areaId: this.formData.area,
          tag: "isTag"
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/TopPage.less";
</style>
