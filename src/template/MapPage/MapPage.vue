<template>
  <div class="mapPage w-full h-full">
    <div class="w-full h-full">
      <div class="flex w-full h-full">
        <div class="flex flex-column w-50 gap-y-4">
          <div id="map" class="w-full flex-1"></div>
          <div class="!h-64 font-color">
            <div class="w-full p-2 text-18 radius-2 bgc">研修钻井1004井</div>
            <div>
              <div class="flex gap-x-4">
                <div class="flex-1">
                  <!-- 后台返回数据后修改为class-->
                  <div class="flex w-full p-2">
                    <div class="p-2 radius-6" style=" background: #061C38;">
                      经度：{{ lon }}
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex w-full p-2">
                    <div class="p-2 radius-6" style=" background: #061C38;">
                      纬度：{{ lat }}
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex w-full p-2">
                    <div class="p-2 radius-6" style=" background: #061C38;">
                      工况：{{ lon }}
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex w-full p-2">
                    <div class="p-2 radius-6" style=" background: #061C38;">
                      井型：{{ well_type }}
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div class="mx-6 bg-div width15">
          <well-type-menu class="p-4" :well-name="wellName" :display-item="displayItem" @checkboxConfirm="checkboxConfirm"
            @goDetail="goDetail" />
        </div>
        <div class="flex-1 h-full bg-div">
          <well-chart title-size="small" :well-depth-data="wellDepthData" :display-list="chartDisplayList"
            :depth="depth" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import mapJSON from "../../assets/map.json";
import mapJSON2 from "../../assets/mapWithoutChild.json";
import WellTypeMenu from "../../components/wellTypeMenu/WellTypeMenu.vue";
import WellChart from "../wellChart/wellChart.vue";
import { maxBy, minBy, merge } from "lodash";
import {
  getWellArea,
  getWellListById,
  getWellList,
  getAllWellDataApi
} from "../../api/homePageApi.js";
import { drillingOptions, loggingOptions } from "../../utils/utils.js";
import { isArray } from "lodash";
export default {
  name: "MapPage",
  props: [],
  components: {
    WellChart,
    WellTypeMenu
  },
  mounted () {
    this.getArea();
    var myChart = echarts.init(document.getElementById("map"));
    echarts.registerMap("xa", mapJSON);

    echarts.registerMap("xa2", mapJSON2);
    var option = {
      geo: [
        {
          map: "xa",
          zoom: 1,
          center: [118.00853, 36.01078],
          label: {
            show: false
          },
          itemStyle: {
            color: "#00fddb8f",
            borderColor: "#00fddb",
            borderWidth: 2,
            opacity: 0.1
          }
        }
      ],
      series: [
        //绘制一个新地图
        {
          type: "map",
          map: "xa2",
          zoom: 1,
          center: [118.00853, 36.01078],
          z: -1,
          itemStyle: {
            normal: {
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 1,
                colorStops: [
                  {
                    offset: 0.5,
                    color: "#ffffff00" // 0% 处的颜色
                  },

                  {
                    offset: 0.7,
                    color: "#4ae5d028" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#60e6f3" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              },
              shadowColor: "#60e6f3",
              shadowBlur: 50,
              borderColor: "white",
              borderWidth: 4,
              shadowOffsetX: 10,
              shadowOffsetY: 10,
              opacity: 1
            }
          }
        },
        // {
        //   type: "map",
        //   map: "xa3",
        //   zoom: 1,
        //   center: [118.00853, 36.05078],
        //   z: -2,
        //   itemStyle: {
        //     normal: {
        //       areaColor: '#00fddb',
        //       shadowColor: "#60e6f3",
        //       shadowBlur: 50,
        //       borderColor: "white",
        //       borderWidth: 4,
        //       shadowOffsetX: 10,
        //       shadowOffsetY: 10,
        //       opacity: 0.1
        //     }
        //   }
        // },
        {
          type: "effectScatter", // 特效散点图
          coordinateSystem: "geo",
          symbol: "circle",
          symbolSize: 18,
          colorBy: "series",
          //显示name并设置样式
          label: {
            show: false
          },
          //涟漪效果设置
          rippleEffect: {
            color: "#32479d",
            number: 3,
            period: 4,
            scale: 4,
            brushType: "stroke"
          },
          itemStyle: {
            color: "#23f3d6",
            borderColor: "#32479d",
            borderWidth: 2
          },
          data: [
            [118.00853, 36.181634],
            [117.00853, 36.911634]
          ]
        }
      ]
    };
    myChart.setOption(option);

    // options 为echart 的配置
    option && myChart.setOption(option, { notMerge: true });

    window.addEventListener("resize", function () {
      myChart.resize();
    });
  },
  data () {
    return {
      wellName: "",
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
      wellName: "",
      depth: [],
      lat: 0,
      lon: 0,
      conditions: 0,
      well_type: 0
    };
  },
  methods: {
    async getArea () {
      const res = await getWellArea();
      if (res.code === "0") {
        this.options = res.data;
        if (res.data) {
          this.formData.area = res.data[0].id;
          this.getInitList();
        }
      }
    },
    async getInitList () {
      const params = { id: this.formData.area };
      const res = await getWellListById(params);
      if (res.code === "0") {
        this.chunkData = res.data;
        if (res.data && res.data.length) {
          this.lat = res.data[0].lat;
          this.lon = res.data[0].lon;
          this.conditions = res.data[0].conditions;
          this.well_type = res.data[0].well_type;
        }

        this.wellName = res.data[0].well_name;
        this.getWellData(this.wellName);
      }
    },
    onChange () {
      this.formData.searchValue = "";
      this.getInitList();
    },
    async onSearch (val) {
      if (!val.searchValue) {
        this.getArea();
        return;
      }
      const params = {
        id: val.area,
        name: val.searchValue
      };
      const res = await getWellList(params);
      if (res.code === "0") {
        this.chunkData = isArray(res.data) ? res.data : [res.data];
      }
    },
    onShow (val) {
      this.wellName = val.well_name;
      this.getWellData(this.wellName);
    },
    async getWellData (name) {
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
    getChartData (value) {
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

        const foundData = [...drillingOptions, ...loggingOptions].find(
          item => item.value === itemKey
        );
        const name = foundData.label;
        const color = foundData.color;
        const unit = foundData.unit ? foundData.unit : "";
        Object.assign(data, {
          [itemKey]: {
            max: maxItem[itemKey],
            min: minItem[itemKey],
            name,
            color,
            unit,
            chartData
          }
        });
      });
      let result = [[data[value[0]]], [data[value[1]]], [data[value[2]]]];
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
    checkboxConfirm (value) {
      if (value.length < 3) return;
      this.displayItem = value;
      this.getChartData(value);
    },
    goDetail () {
      this.$router.push({
        path: "/DrillVisualizationPage",
        query: { wellName: this.wellName }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/MapPage.less";
</style>
