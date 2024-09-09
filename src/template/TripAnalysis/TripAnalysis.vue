<template>
  <div class="drillingAnalysis flex-1 flex">
    <div class="flex-1 h-full flex">
      <div style="width: 100px" class="flex flex-column">
        <div class="text-lg text-bold my-2 text-center">层位</div>
        <div class="flex-1">
          <div class="drillBarChart w-full h-full"></div>
        </div>
      </div>
      <div class="flex flex-1 w-full gap-x-2 justify-between">
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">
            钩载路线图
          </div>
          <div class="flex-1 relative">
            <div class="hookLoadRouteChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 18px)"
            >
              轴向力/kN
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">扭矩路线图</div>
          <div class="flex-1 relative">
            <div class="torqueRoadChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 18px)"
            >
              扭矩/kN.m
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">井斜角/*</div>
          <div class="flex-1 relative">
            <div class="wellInclinationAngleChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 56px)"
            >
              狗腿度(°/30m)
            </div>
          </div>
        </div>
        <div style="width: 400px" class="flex">
          <div class="flex flex-column flex-1">
            <div class="text-lg text-bold my-2 text-center">历史分析</div>
            <div class="flex-1 relative">
              <div class="historicalAnalysisChart w-full h-full"></div>
              <div
                class="absolute bottom-0 text-18"
                style="right: calc(50% - 36px)"
              >
                摩阻系数
              </div>
            </div>
          </div>
          <div class="flex flex-column flex-1">
            <div class="text-lg text-bold my-2 text-center">超前预测</div>
            <div class="flex-1 relative">
              <div class="advancePredictionChart w-full h-full"></div>
              <div
                class="absolute bottom-0 text-18"
                style="right: calc(50% - 36px)"
              >
                摩阻系数
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { floor, isEmpty } from "lodash";
import { landLayerMapping } from "@/utils/utils.js";
const Y_AXIS_SPLIT_NUMBER = 4;
export default {
  name: "DrillingAnalysis",
  props: {
    trajectoryData: {
      type: Array,
      default: () => []
    },
    hookData: {
      type: Object,
      default: () => {}
    },
    torqueData: {
      type: Object,
      default: () => {}
    },
    bucklingLimitData: {
      type: Object,
      default: () => {}
    },
    NHGZN: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      horizonName: [{ name: "N2d" }, { name: "T3b" }]
    };
  },
  watch: {
    hookData: {
      handler() {
        this.$nextTick(() => {
          this.createHookLoadRouteChart();
        });
      }
    },
    NHGZN: {
      handler() {
        this.$nextTick(() => {
          this.createHookLoadRouteChart();
          this.createTorqueRoadChart();
        });
      }
    },
    torqueData: {
      handler() {
        this.$nextTick(() => {
          this.createTorqueRoadChart();
        });
      }
    },
    bucklingLimitData: {
      handler() {
        this.$nextTick(() => {
          this.createTorqueRoadChart();
        });
      }
    },
    trajectoryData: {
      handler() {
        this.$nextTick(() => {
          this.createDragTorque();
        });
      }
    }
  },
  mounted() {
    this.createBar();
    this.createHookLoadRouteChart();
    this.createTorqueRoadChart();
    this.createHistoricalAnalysis();
    this.createAdvancePredictionChart();
    this.createDragTorque();
  },
  methods: {
    createDragTorque() {
      if (!this.trajectoryData.length) return;

      const option4 = {
        legend: {
          z: 10,
          data: ["井斜角", "狗腿度"],
          right: 0,
          textStyle: {
            color: "while"
          }
        },
        yAxis: [
          {
            type: "category",
            data: this.trajectoryData.map(item => parseInt(item.js)),
            inverse: true,
            axisLabel: {
              show: true,
              color: "white",
              interval: 10
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            textStyle: {
              color: "while"
            },
            type: "value",
            min: "dataMin",
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: "white"
            },
            axisLine: {
              show: false
            }
          },
          {
            inverse: true,
            textStyle: {
              color: "while"
            },
            position: "top",
            type: "value",
            min: "dataMin",
            splitLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: "white"
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "井斜角",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            lineStyle: {
              type: "solid",
              color: "#ff4545"
            },
            itemStyle: {
              color: "#ff4545"
            },
            clip: false,
            data: this.trajectoryData.map(item => parseInt(item.jxj)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "狗腿度",
            xAxisIndex: 1,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            lineStyle: {
              type: "solid",
              color: "#e225e4"
            },
            itemStyle: {
              color: "#e225e4"
            },
            clip: false,
            data: this.trajectoryData.map(item => parseInt(item.fwj)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        backgroundColor: "#000c37d9"
      };
      const chartDom4 = document.getElementsByClassName(
        "wellInclinationAngleChart"
      )[0];

      const echart4 = echarts.init(chartDom4);
      echart4.setOption(option4, true);
      window.addEventListener("resize", function() {
        echart4.resize();
      });
    },
    createBar() {
      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        xAxis: {
          type: "category",
          show: false,
          data: [""]
        },
        tooltip: {
          showDelay: 0,
          width: 100,
          transitionDuration: 0
        },
        yAxis: {
          type: "value",
          show: false,
          splitNumber: 200,
          inverse: true,
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "T3b",
            type: "bar",
            stack: "Total",
            label: false,
            z: 0,
            itemStyle: {
              borderColor: "#FFF2CC"
            },
            color: "#FFF2CC",
            data: [3408.96],
            animationDuration: 0
          },
          {
            name: "T1b",
            type: "bar",
            stack: "Total",
            label: false,
            z: 1,
            itemStyle: {
              borderColor: "#FFD966"
            },
            color: "#FFD966",
            data: [3409.96],
            animationDuration: 0
          }
        ]
      };
      const chartDom = document.getElementsByClassName("drillBarChart")[0];
      const echart = echarts.init(chartDom);
      echart.setOption(option, true);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    },
    createHookLoadRouteChart() {
      // 判断接口是否返回参数，如果未返回则不进行图标渲染
      if (isEmpty(this.hookData)) return;

      const commonDownProps = {
        xAxisIndex: 0,
        symbol: "none",
        smooth: 0.6,
        type: "line",
        clip: false,
        animationDuration: 0,
        animationEasingUpdate: "linear"
      };
      const downData = [
        {
          name: "下放F=0.1",
          data: this.hookData.SlidingDownFF1.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#ff6000"
          },
          itemStyle: {
            color: "#ff6000"
          },
          ...commonDownProps
        },
        {
          name: "下放F=0.2",
          data: this.hookData.SlidingDownFF2.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#ff731f"
          },
          itemStyle: {
            color: "#ff731f"
          },
          ...commonDownProps
        },
        {
          name: "下放F=0.3",
          data: this.hookData.SlidingDownFF3.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#ff8237"
          },
          itemStyle: {
            color: "#ff8237"
          },
          ...commonDownProps
        },
        {
          name: "下放F=0.4",
          data: this.hookData.SlidingDownFF4.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#ff9657"
          },
          itemStyle: {
            color: "#ff9657"
          },
          ...commonDownProps
        },
        {
          name: "下放F=0.5",
          data: this.hookData.SlidingDownFF5.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#ffa874"
          },
          itemStyle: {
            color: "#ffa874"
          },
          ...commonDownProps
        }
      ];

      const commonUpProps = {
        xAxisIndex: 0,
        symbol: "none",
        smooth: 0.6,
        type: "line",
        clip: false,
        lineStyle: {
          width: 2
        },
        animationDuration: 0,
        animationEasingUpdate: "linear"
      };

      const upData = [
        {
          name: "上提F=0.1",
          data: this.hookData.SlidingLiftingFF1.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#9f00ff"
          },
          itemStyle: {
            color: "#9f00ff"
          },
          ...commonUpProps
        },
        {
          name: "上提F=0.2",
          data: this.hookData.SlidingLiftingFF2.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#a71ef9"
          },
          itemStyle: {
            color: "#a71ef9"
          },
          ...commonUpProps
        },
        {
          name: "上提F=0.3",
          data: this.hookData.SlidingLiftingFF3.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#b338fd"
          },
          itemStyle: {
            color: "#b338fd"
          },
          ...commonUpProps
        },
        {
          name: "上提F=0.4",
          data: this.hookData.SlidingLiftingFF4.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#bb54f9"
          },
          itemStyle: {
            color: "#bb54f9"
          },
          ...commonUpProps
        },
        {
          name: "上提F=0.5",
          data: this.hookData.SlidingLiftingFF5.map(item => floor(item, 2)),
          lineStyle: {
            width: 2,
            type: "dashed",
            color: "#c673f7"
          },
          itemStyle: {
            color: "#c673f7"
          },
          ...commonUpProps
        },
        {
          name: "空转",
          itemStyle: {
            color: "#3aff66"
          },
          data: this.hookData.RotateFree.map(item => floor(item, 2)),
          ...commonUpProps
        }
      ];
      const option = {
        yAxis: [
          {
            type: "category",
            data: this.hookData.depth,
            inverse: true,
            axisLabel: {
              show: true,
              color: "white",
              interval: 10
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          {
            type: "value",
            data: !isEmpty(this.NHGZN)
              ? this.NHGZN.map(item => parseFloat(item.BIT_DEPTH))
              : [],
            inverse: true,
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: "value",
            min: "dataMin",
            axisLabel: {
              show: true,
              color: "white"
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            position: "bottom"
          },
          {
            type: "value",
            axisLabel: {
              show: false,
              color: "white"
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        legend: {
          data: [
            "下放F=0.1",
            "下放F=0.2",
            "下放F=0.3",
            "下放F=0.4",
            "下放F=0.5",
            "上提F=0.1",
            "上提F=0.2",
            "上提F=0.3",
            "上提F=0.4",
            "上提F=0.5",
            "空转",
            "实测"
          ],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        series: [
          ...downData,
          ...upData,
          {
            name: "实测",
            symbolSize: 10,
            data: !isEmpty(this.NHGZN)
              ? this.NHGZN.map(item => [
                  parseFloat(item.BIT_DEPTH),
                  parseFloat(item.WHO)
                ])
              : [],
            type: "scatter",
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
              color: "#ff2d2d"
            }
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        backgroundColor: "#000c37d9"
      };

      const chartDom = document.getElementsByClassName("hookLoadRouteChart")[0];
      const echart = echarts.init(chartDom);

      echart.setOption(option, true);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    },
    createTorqueRoadChart() {
      if (isEmpty(this.torqueData.depth)) return;

      const option = {
        yAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.torqueData.depth,
            inverse: true,
            axisLabel: {
              show: true,
              color: "white",
              interval: 10
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitNumber: 10
          },
          {
            type: "value",
            data: !isEmpty(this.NHGZN)
              ? this.NHGZN.map(item => parseFloat(item.BIT_DEPTH))
              : [],
            inverse: true,
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: "value",
            min: "dataMin",
            axisLabel: {
              show: true,
              color: "white"
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            position: "bottom"
          },
          {
            type: "value",
            axisLabel: {
              show: false,
              color: "white"
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        legend: {
          data: [
            "空钻F=0.1",
            "空钻F=0.2",
            "空钻F=0.3",
            "空钻F=0.4",
            "空钻F=0.5",
            "实测"
          ],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        series: [
          {
            name: "空钻F=0.1",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 2,
              type: "dashed",
              color: "#ffe200"
            },
            itemStyle: {
              color: "#ffe200"
            },
            data: this.torqueData.FF1.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "空钻F=0.2",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 2,
              type: "dashed",
              color: "#ffe833"
            },
            itemStyle: {
              color: "#ffe833"
            },
            data: this.torqueData.FF2.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "空钻F=0.3",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 2,
              type: "dashed",
              color: "#ffeb52"
            },
            itemStyle: {
              color: "#ffeb52"
            },
            data: this.torqueData.FF3.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "空钻F=0.4",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 2,
              type: "dashed",
              color: "#fff180"
            },
            itemStyle: {
              color: "#fff180"
            },
            data: this.torqueData.FF4.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "空钻F=0.5",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 2,
              type: "dashed",
              color: "#fff49e"
            },
            itemStyle: {
              color: "#fff49e"
            },
            data: this.torqueData.FF5.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            name: "实测",
            symbolSize: 10,
            data: !isEmpty(this.NHGZN)
              ? this.NHGZN.map(item => [
                  parseFloat(item.BIT_DEPTH),
                  parseFloat(item.ROTARY_TORQUE)
                ])
              : [],
            type: "scatter",
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
              color: "#ff2d2d"
            }
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        backgroundColor: "#000c37d9"
      };

      const chartDom = document.getElementsByClassName("torqueRoadChart")[0];
      const echart = echarts.init(chartDom);
      echart.setOption(option, true);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    },

    createHistoricalAnalysis() {
      const option = {
        legend: {
          data: ["上提", "下放"],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        yAxis: [
          {
            // type: "category",
            // boundaryGap: false,
            // data: [0, 1000, 2000, 3000, 4000],
            // inverse: true,
            splitLine: {
              show: true
            },
            textStyle: {
              color: "while"
            },
            axisLabel: {
              show: false,
              color: "white"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            textStyle: {
              color: "while"
            },
            type: "value",
            min: "dataMin",
            splitLine: {
              show: true
            },
            axisLabel: {
              show: true,
              color: "white"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "上提",
            symbolSize: 10,
            data: [
              [0.3, 8.04],
              [0, 6.95]
            ],
            type: "scatter"
          },
          {
            name: "下放",
            symbolSize: 10,
            data: [
              [0.1, 0],
              [0.2, 2010],
              [0.35, 3010],
              [1, 2010]
            ],
            itemStyle: {
              color: "rgba(224, 96, 96, 1)"
            },
            type: "scatter"
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        backgroundColor: "#000c37d9"
      };
      const chartDom = document.getElementsByClassName(
        "historicalAnalysisChart"
      )[0];
      const echart = echarts.init(chartDom);
      echart.setOption(option, true);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    },
    createAdvancePredictionChart() {
      const option = {
        legend: {
          data: ["上提", "下放"],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        yAxis: [
          {
            // type: "category",
            // boundaryGap: false,
            // data: [0, 1000, 2000, 3000, 4000],
            // inverse: true,
            splitLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            textStyle: {
              color: "while"
            },
            axisLabel: {
              show: false,
              color: "white"
            },
            axisLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            textStyle: {
              color: "while"
            },
            type: "value",
            min: "dataMin",
            splitLine: {
              show: true
            },
            axisLabel: {
              show: true,
              color: "white"
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "上提",
            symbolSize: 10,
            data: [
              [0.1, 8.04],
              [0.44, 6.95],
              [0.12, 7.58],
              [0.9, 8.81],
              [1, 8.33]
            ],
            type: "scatter"
          },
          {
            name: "下放",
            symbolSize: 10,
            data: [
              [0, 7.04],
              [1, 1.95]
            ],
            itemStyle: {
              color: "rgba(224, 96, 96, 1)"
            },
            type: "scatter"
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        backgroundColor: "#000c37d9"
      };
      const chartDom = document.getElementsByClassName(
        "advancePredictionChart"
      )[0];
      const echart = echarts.init(chartDom);
      echart.setOption(option, true);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    }
  }
};
</script>

<style></style>
