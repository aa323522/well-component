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
        <div class="flex flex-column" style="width: 120px">
          <div class="text-lg text-bold my-2 text-center">钻具组合</div>
          <div class="flex-1">
            <!-- <img src="@/assets/info.png" alt="" class="h-full w-full" /> -->
          </div>
        </div>
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">
            等效拉力-对钻压敏感性
          </div>
          <div class="flex-1 relative">
            <div class="sensitivityToDrillingPressureChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 18px)"
            >
              轴向力/kN
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">钻进扭矩</div>
          <div class="flex-1 relative">
            <div class="drillingTorqueChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 18px)"
            >
              扭矩/kN.m
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-1">
          <div class="text-lg text-bold my-2 text-center">侧向力</div>
          <div class="flex-1 relative">
            <div class="lateralForceChart w-full h-full"></div>
            <div
              class="absolute bottom-0 text-18"
              style="right: calc(50% - 18px)"
            >
              侧向力/kN
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
        <div class="flex flex-column" style="width: 120px">
          <div class="text-lg text-bold my-2 text-center">井身结构</div>
          <div class="flex-1">
            <img src="../../assets/info.png" alt="" class="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { floor } from "lodash";

export default {
  name: "DrillingAnalysis",
  props: {
    bucklingLimitData: {
      type: Object,
      default: () => {}
    },
    trajectoryData: {
      type: Array,
      default: () => []
    },
    dragTorqueData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
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
    },
    trajectoryData: {
      handler() {
        this.$nextTick(() => {
          this.createDragTorque();
        });
      }
    },
    dragTorqueData: {
      handler() {
        this.$nextTick(() => {
          this.createMap();
        });
      }
    }
  },
  data() {
    return {
      horizonName: [{ name: "N2d" }, { name: "T3b" }],
      echart1: undefined,
      echart2: undefined
    };
  },
  mounted() {
    this.createTorqueRoadChart();
    this.createBar();
    this.createDragTorque();
    this.createMap();

    setTimeout(() => {
      echarts.connect(this.echart1, this.echart2);
    }, 500);
  },
  methods: {
    createTorqueRoadChart() {
      const option1 = {
        zoom: {},
        yAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.bucklingLimitData.depth,
            inverse: true,
            axisLabel: {
              show: true,
              color: "white",
              interval: 1000
            },
            axisTick: {
              show: true
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: "value",
            min: "dataMin",
            name: "轴向力",
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              color: "white"
            }
          }
        ],
        legend: {
          data: ["轴向力", "正弦屈曲", "螺旋屈曲 + 旋转", "螺旋屈曲 + 滑动"],
          right: 0,
          textStyle: {
            color: "while"
          }
        },
        series: [
          {
            z: 1,
            name: "正弦屈曲",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 1,
              type: "solid",
              color: "#0bff0b"
            },
            itemStyle: {
              color: "#0bff0b"
            },

            data: this.bucklingLimitData.SinBuckling.map(item =>
              floor(item, 2)
            ),
            animationDuration: 0,
            animationEasingUpdate: "linear",
            areaStyle: {
              color: "rgba(130, 225, 83, 1)",
              origin: "start"
            }
          },
          {
            z: 2,
            name: "螺旋屈曲 + 旋转",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 1,
              type: "solid",
              color: "yellow"
            },
            itemStyle: {
              color: "yellow"
            },
            data: this.bucklingLimitData.HelBuckling_rotate.map(item =>
              floor(item, 2)
            ),
            animationDuration: 0,
            animationEasingUpdate: "linear",
            areaStyle: {
              color: "rgba(232, 210, 42, 1)",
              origin: "start"
            }
          },
          {
            z: 3,
            name: "螺旋屈曲 + 滑动",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            lineStyle: {
              width: 1,
              type: "solid",
              color: "red"
            },
            itemStyle: {
              color: "red"
            },
            areaStyle: {
              color: "#ff5f5f",
              origin: "start"
            },
            data: this.bucklingLimitData.HelBuckling_slide.map(item =>
              floor(item, 2)
            ),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          },
          {
            z: 100,
            name: "轴向力",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            clip: false,
            data: this.bucklingLimitData.AxialForce.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear",
            lineStyle: {
              width: 2,
              color: "#35eff9"
            },
            itemStyle: {
              color: "#35eff9"
            }
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 0,
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

      const chartDom1 = document.getElementsByClassName(
        "sensitivityToDrillingPressureChart"
      )[0];
      const echart1 = echarts.init(chartDom1);
      echart1.setOption(option1, true);
      window.addEventListener("resize", function() {
        echart1.resize();
      });
      this.echart1 = echart1;
    },
    createMap() {
      const option2 = {
        legend: {
          data: ["扭矩"],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        yAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.dragTorqueData.depth,
            inverse: true,
            textStyle: {
              color: "while"
            },
            axisLabel: {
              show: true,
              color: "white",
              interval: 1000
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
            splitNumber: 2
          }
        ],
        xAxis: [
          {
            textStyle: {
              color: "while"
            },
            type: "value",
            axisLabel: {
              show: true,
              color: "white",

              splitNumber: 20
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
        series: [
          {
            z: 100,
            name: "扭矩",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            lineStyle: {
              type: "solid",
              color: "yellow"
            },
            itemStyle: {
              color: "yellow"
            },
            clip: false,
            data: this.dragTorqueData.Torque.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 0,
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
      const chartDom2 = document.getElementsByClassName(
        "drillingTorqueChart"
      )[0];
      const echart2 = echarts.init(chartDom2);
      echart2.setOption(option2, true);
      window.addEventListener("resize", function() {
        echart2.resize();
      });

      const option3 = {
        legend: {
          data: ["侧向力"],
          right: 0,
          textStyle: {
            color: "while"
          },
          width: 0
        },
        yAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.dragTorqueData.depth,
            inverse: true,
            splitLine: {
              show: true
            },
            textStyle: {
              color: "while"
            },
            axisLabel: {
              show: true,
              color: "white",
              interval: 1000
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
              color: "white",
              interval: 2
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
            splitNumber: 5
          }
        ],
        series: [
          {
            z: 100,
            name: "侧向力",
            xAxisIndex: 0,
            symbol: "none",
            smooth: 0.6,
            type: "line",
            lineStyle: {
              type: "solid",
              color: "#19ff00"
            },
            itemStyle: {
              color: "#19ff00"
            },
            clip: false,
            data: this.dragTorqueData.LateralForce.map(item => floor(item, 2)),
            animationDuration: 0,
            animationEasingUpdate: "linear"
          }
        ],
        grid: {
          containLabel: true,
          left: 10,
          right: 0,
          top: 50,
          bottom: 50
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          transitionDuration: 0
        },
        zoom: {},
        backgroundColor: "#000c37d9"
      };
      const chartDom3 = document.getElementsByClassName("lateralForceChart")[0];
      const echart3 = echarts.init(chartDom3);
      echart3.setOption(option3, true);
      window.addEventListener("resize", function() {
        echart3.resize();
      });

      this.echart2 = echart3;
    },
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
            data: this.trajectoryData.map(item => floor(parseInt(item.jxj), 2)),
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
            data: this.trajectoryData.map(item => floor(parseInt(item.fwj), 2)),
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
          inverse: true
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
      // const option = {
      //   grid: {
      //     left: 0,
      //     top: 0,
      //     right: 0,
      //     bottom: 0
      //   },
      //   xAxis: {
      //     type: "category",
      //     show: false,
      //     data: [""]
      //   },
      //   tooltip: {
      //     showDelay: 0,
      //     width: 100,
      //     transitionDuration: 0
      //   },
      //   yAxis: {
      //     type: "value",
      //     show: false,
      //     splitNumber: 200,
      //     inverse: true
      //   },

      //   series: this.horizonName.map((item, index) => ({
      //     name: item.name,
      //     type: "bar",
      //     stack: "Total",
      //     label: false,
      //     z: index,
      //     itemStyle: {
      //       borderColor: "red"
      //     },
      //     color: "red",
      //     data: 1,

      //     animationDuration: 0
      //   }))
      // };
      const chartDom1 = document.getElementsByClassName("drillBarChart")[0];

      const echart1 = echarts.init(chartDom1);

      echart1.setOption(option, true);
      window.addEventListener("resize", function() {
        echart1.resize();
      });
    }
  }
};
</script>

<style></style>
