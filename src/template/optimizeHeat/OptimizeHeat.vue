<template>
  <div class="flex flex-column gap-y-2 h-full">
    <div class="flex gap-x-2" style="height: 400px;">
      <div class="flex-1">
        <heat-map
          :levelList="levelList"
          style="border: 2px solid #7bbfe7"
          unit="层"
          chartId="optimizeHeatChart"
          :wellName="wellName"
          type="optimize"
        />
      </div>
      <div
        class="flex-1"
        style="background: rgb(8, 38, 74); border: 2px solid #7bbfe7"
      >
        <div class="flex justify-between p-2 flex-1 relative">
          <div class="absolute top-2 z-10 pointer">
            <div class="text-lg">
              <!-- <span @click="handleChangeFrequencyType('wob')"
                >钻压频率分布图</span
              >/<span @click="handleChangeFrequencyType('rpm')"
                >转速频率分布图</span
              > -->
              <a-dropdown>
                <a-menu
                  slot="overlay"
                  @click="
                    e => {
                      handleChangeFrequencyType(
                        e.key == '钻压频率分布图' ? 'wob' : 'rpm'
                      );
                    }
                  "
                >
                  <a-menu-item v-for="item in typeList" :key="item">
                    {{ item }}
                  </a-menu-item>
                </a-menu>
                <div
                  class="px-4 py-2"
                  style="border-top: 0.125rem solid #12BDFF; background: linear-gradient(180deg, #080F26 0%, #0C1B4F 100%)"
                >
                  {{ selectType }}
                </div>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div id="frequencyDistributionChart" class="w-full h-full"></div>
      </div>
      <div
        class="flex-1"
        style="background: rgb(8, 38, 74); border: 2px solid #7bbfe7"
      >
        <div class="flex justify-between p-2 flex-1 relative">
          <div class="absolute top-2">
            <span class="text-lg">钻压敏感性分析图</span>
          </div>
        </div>
        <div id="chartId3" class="w-full h-full"></div>
      </div>
    </div>
    <div class="flex flex-column gap-y-2 flex-1">
      <div class="w-full flex-1" style="border: 2px solid #7bbfe7">
        <div id="chartId4" class="w-full h-full"></div>
      </div>
      <div class="w-full flex-1" style="border: 2px solid #7bbfe7">
        <div id="chartId5" class="w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, floor } from "lodash";
import HeatMap from "../../template/WellVisualizationCharts/HeatMap/HeatMap.vue";
import * as echarts from "echarts";
import {
  getWellList,
  getHorizonNameList,
  getRpm,
  getWob,
  getMseCalAndFull,
  getScatterPlot,
  getEnvelopeCurve
} from "../../api/detectionAndImprovementApi.js";
import RecommendedParameters from "../../components/RecommendedParameters/RecommendedParameters.vue";
export default {
  name: "DetectionAndImprovement",
  props: {
    horizonName: {
      type: String
    },
    wellName: {
      type: String
    },
    setWellName: {
      type: Function,
      default: () => {}
    },
    setLoading: {
      type: Function,
      default: () => {}
    },
  },
  components: {
    HeatMap,
    RecommendedParameters
  },
  watch: {
    // type: {
    //   handler(v) {
    //     if (this.chart1) {
    //       setTimeout(() => {
    //         this.chart1.resize();
    //       }, 500);
    //     }

    //     if (this.chart2) {
    //       this.chart2.resize();
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    horizonName: {
      handler(v) {
        if (v) this.init();
      },
      deep: true,
      immediate: true
    },
    wellName: {
      handler(v) {
        if (v) this.init();
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      type: "HEAT",
      wellList: [],
      levelList: [],
      rpmData: undefined,
      wobData: undefined,
      mseCalAndFullData: undefined,
      frequencyDistributionType: "wob",
      typeList: ["钻压频率分布图", "转速频率分布图"],
      selectType: "钻压频率分布图",
      selectedPointer: [],
      selectFlag: false,
      timer: undefined,
      scatterData: [],
      selectData: [],
      chart1: undefined,
      chart2: undefined,
      chart3: undefined,
      chart4: undefined,
      chart5: undefined
    };
  },
  mounted() {
    // this.init()
  },
  methods: {
    async init() {
      if (!this.horizonName || !this.wellName) return;
      await Promise.all([
        this.handleGetWellName(),
        this.handleGetLevelList(),
        this.handleGetRpm(),
        this.handleGetWob(),
        this.handleGetMseCalAndFull()
      ]);

      this.handleChangeFrequencyType("wob");
      this.init3();
      this.init5();
      this.init6();

      this.setLoading(false)
    },
    async handleGetWob() {
      const { success, data } = await getWob({
        horizonName: this.horizonName,
        wellName: this.wellName
      });

      if (success != true) return;

      this.wobData = data;
    },
    async handleGetRpm() {
      const { success, data } = await getRpm({
        horizonName: this.horizonName,
        wellName: this.wellName
      });
      if (success != true ) return;
      this.rpmData = data;
    },
    async handleGetWellName() {
      const { success, data } = await getWellList();
      if (success != true ) return;
      this.wellList = data;
    },
    async handleGetLevelList() {
      const { success, data } = await getHorizonNameList();
      if (success != true ) return;
      this.levelList = data;
    },
    async handleGetMseCalAndFull() {
      const { success, data } = await getMseCalAndFull({
        wellName: this.wellName
      });
      if (success != true) return;
      this.mseCalAndFullData = data;
    },
    async handleGetScatterPlot() {
      const { success, data: scatterData } = await getScatterPlot({
        horizonName: this.horizonName,
        wellName: this.wellName
      });

      if (success != true || !scatterData.length) return;

      this.scatterData = scatterData
      const scatterSeriesData = this.scatterData.map(item => [(item.wob || item.WOB) , (item.rop || item.ROP)]);
      let envelopeSeriesData = []
        if (this.selectData.length) {
          const params = this.selectData

          const { success: isSuccess, data } = await getEnvelopeCurve(params);
          if (isSuccess != true) return;

          envelopeSeriesData = data.map(item => [(item.wob || item.WOB),  (item.rop || item.ROP)]);
        }


      return {
        scatterSeriesData,
        envelopeSeriesData
      };
    },
    handleMenuClick(e) {
      setWellName(e.key);
    },
    handleChangeFrequencyType(type) {
      if (type == "wob") {
        this.selectType = "钻压频率分布图";
      } else {
        this.selectType = "转速频率分布图";
      }
      this.frequencyDistributionType = type;
      var chartDom = document.getElementById("frequencyDistributionChart");
      if (!chartDom) return

      var myChart = echarts.init(chartDom);
      var option;

      const currentData = type === "wob" ? this.wobData : this.rpmData;
      const xFiledName = type === "wob" ? "X_WOB" : "X_RPM";
      const yFiledName = type === "wob" ? "Y_WOB" : "Y_RPM";
      if (isEmpty(currentData)) return;

      const xAxisData = currentData.pd.map(item => floor(item[xFiledName], 2));
      const yAxisData = currentData.pd.map(item => floor(item[yFiledName], 2));
      const markLine = currentData.pd.map((_, index) => ({
        xAxis: index
      }));
      option = {
        tooltip: {},
        grid: {
          bottom: 40,
          left: 20,
          right: 50,
          backgroundColor: "#0D112A",
          show: true
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          axisLabel: {
            color: "white",
            fontSize: 16
          }
        },
        yAxis: {
          type: "value",
          position: "right",
          name: `${
            this.frequencyDistributionType === "wob"
              ? "钻压(tone)"
              : "转盘转速(RPM)"
          } / 频率`,
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 14,
            padding: [0, 130, -5, 0]
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          axisLabel: {
            color: "white",
            fontSize: 16
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: yAxisData,
            type: "bar",
            markLine: {
              symbol: ["none", "none"],
              label: { show: false },
              data: markLine
            },
            itemStyle: {
              color: "rgba(14, 242, 212, 1)"
            }
          }
        ],
        animationDuration: 0
      };

      option && myChart.setOption(option);
    },
    async init3() {
      const seriesData = await this.handleGetScatterPlot();

      if (!seriesData) return

      var chartDom = document.getElementById("chartId3");
      if (!chartDom) return
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        grid: {
          left: 0,
          right: 20,
          bottom: 80,
          top: 40,
          containLabel: true
        },
        xAxis: [
          {
            show: true,
            position: "bottom",
            splitLine: {
              show: false
            },
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            },
            axisLabel: {
              color: "white",
              fontSize: 16
            }
          }
        ],
        yAxis: [
          {
            show: false,
            position: "left",
            alignTicks: true,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            },
            axisLabel: {
              color: "white",
              fontSize: 16
            }
          },
          {
            name: "机械钻速（m/h)/钻压（kN）",
            show: true,
            nameLocation: "end",
            nameTextStyle: {
              fontSize: 16,
              padding: [0, -750, -5, 0],
              color: "white"
            },
            position: "left",
            alignTicks: true,
            offset: 0,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            },
            axisLabel: {
              color: "white",
              fontSize: 16
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          }
        ],
        tooltip: {},
        dataZoom: [
          {
            type: "slider",
            bottom: 30
          },
          {
            type: "inside"
          }
        ],
        series: [
          {
            symbolSize: 20,
            data: seriesData.scatterSeriesData,
            type: "scatter",
            xAxisIndex: 0,
            yAxisIndex: 0,
            select: {
              itemStyle: {
                color: "#0d112a4f"
              }
            },
            selectedMode: "multiple",
            itemStyle: {
              color: "rgba(119, 215, 95, 1)"
            }
          },
          {
            smooth: 1,
            data: seriesData.envelopeSeriesData,
            type: "line",

            xAxisIndex: 0,
            yAxisIndex: 1
          }
        ],
        animationDuration: 0
      };


      option && myChart.setOption(option);

      const that = this;
      myChart.off("click");
      myChart.on("click", async e => {
        const foundIndex = that.selectedPointer.findIndex(item => {
          if (JSON.stringify(item) == JSON.stringify(e.data)) return true;
        });
        if (foundIndex !== -1) {
          that.selectedPointer.splice(foundIndex, 1);

        } else {
          that.selectedPointer.push(e.data);
          that.selectData.push({ROP: e.data[1], WOB: e.data[0]})
        }

        that.selectFlag = false;
        that.init3();
      });
    },
    init5() {
      var chartDom = document.getElementById("chartId4");

      if (!chartDom) return
      var myChart = echarts.init(chartDom);
      var option;

      const yAxisMseData = [];
      const yAxisRopData = [];
      const date = [];

      if (!this.mseCalAndFullData) return
      this.mseCalAndFullData.forEach(item => {
        yAxisMseData.push(floor(item.mse, 2));
        yAxisRopData.push(item.ROP);
        date.push(this.dayjs(item.TIME).format("YYYY年MM月DD日\nHH:mm:ss"));
      });
      option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["机械比能(MPa) / 深度(m)", "机械钻速(m/h) / 深度(m)"],
          right: 0,
          textStyle: {
            color: "while"
          }
        },
        grid: {
          left: 140,
          right: 50,
          bottom: 0,
          top: 40,
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLine: {
            show: true,
            lineStyle: {
              color: "white"
            }
          }
        },
        yAxis: [
          {
            position: "left",
            type: "value",
            splitLine: {
              show: false
            },
            offset: 100,
            alignTicks: true,
            name: "机械比能(MPa) VS 机械钻速(m/h)",
            nameLocation: "end",
            nameTextStyle: {
              fontSize: 14,
              padding: [0, -120, -5, 0]
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          },
          {
            position: "left",
            alignTicks: true,
            type: "value",
            splitLine: {
              show: false
            },
            nameLocation: "end",
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          }
        ],
        series: [
          {
            name: "机械比能(MPa) / 深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            yAxisIndex: 0,
            data: yAxisMseData
          },
          {
            name: "机械钻速(m/h) / 深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            yAxisIndex: 1,
            data: yAxisRopData
          }
        ],
        backgroundColor: "#0d112ac4",

        animationDuration: 0
      };

      option && myChart.setOption(option);
      this.chart1 = myChart
      const that = this
      window.addEventListener("resize", function() {
        that.chart1.resize();
      });
    },
    init6() {
      var chartDom = document.getElementById("chartId5");
      if (!chartDom) return
      var myChart = echarts.init(chartDom);
      var option;

      const yAxisWobData = [];
      const yAxisRpmData = [];
      const yAxisPumpData = [];
      const yAxisDc = [];
      const date = [];
      if (!this.mseCalAndFullData) return

      this.mseCalAndFullData.forEach(item => {
        yAxisWobData.push(item.wob);
        yAxisRpmData.push(item.rotate_speed);
        yAxisPumpData.push(item.pump_rate);
        yAxisDc.push(item.dc);

        date.push(this.dayjs(item.TIME).format("YYYY年MM月DD日\nHH:mm:ss"));
      });

      option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            "钻压(tone) / 深度(m)",
            "转速(rpm) / 深度(m)",
            "流量(L/s) / 深度(m)",
            "声波时差(μs/s)/深度(m)"
          ],
          right: 0,
          textStyle: {
            color: "while"
          }
        },
        grid: {
          left: 220,
          right: 50,
          bottom: 0,
          top: 40,
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLine: {
            show: true,
            lineStyle: {
              color: "white"
            }
          }
        },
        yAxis: [
          {
            position: "left",
            offset: 180,
            type: "value",
            alignTicks: true,
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          },
          {
            position: "left",
            offset: 120,
            type: "value",
            alignTicks: true,
            splitLine: {
              show: false
            },
            nameTextStyle: {
              fontSize: 14
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          },
          {
            position: "left",
            offset: 60,
            type: "value",
            splitLine: {
              show: false
            },
            alignTicks: true,
            nameLocation: "end",
            nameTextStyle: {
              fontSize: 14
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          },
          {
            position: "left",
            type: "value",
            splitLine: {
              show: false
            },
            alignTicks: true,
            offset: 0,
            name: "钻压(tone) VS 转速(rpm) VS 流量(L/s) VS 声波时差(μs/s)",
            nameLocation: "end",
            nameTextStyle: {
              fontSize: 14,
              padding: [0, 0, -5, 0]
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "white"
              }
            }
          }
        ],
        series: [
          {
            name: "钻压(tone) / 深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            data: yAxisWobData,
            yAxisIndex: 0
          },
          {
            name: "转速(rpm) / 深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            data: yAxisRpmData,
            yAxisIndex: 1
          },
          {
            name: "流量(L/s) / 深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            data: yAxisPumpData,
            yAxisIndex: 2
          },
          {
            name: "声波时差(μs/s)/深度(m)",
            symbol: "none",
            type: "line",
            clip: false,
            data: yAxisDc,
            yAxisIndex: 3
          }
        ],
        backgroundColor: "#0d112ac4",
        animationDuration: 0
      };

      option && myChart.setOption(option);
      this.chart2 = myChart
      const that = this
      window.addEventListener("resize", function() {
        that.chart2.resize();
      });
    },
    changeDisplayType(type) {
      this.type = type;
    }
  }
};
</script>

<style lang="less">
@import "../../style/detectionAndImprovement.less";
</style>
../../api/DetectionAndImprovementApi.js
