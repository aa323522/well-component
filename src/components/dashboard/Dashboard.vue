<template>
  <div :id="id" class="w-full" :style="{ height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Dashboard",
  props: {
    id: {
      type: String,
      default: "dashboardChart"
    },
    width: {
      type: String,
      default: "320px"
    },
    height: {
      type: String,
      default: "290px"
    },
    value: {
      type: Number,
      default: 0
    },
    isRisk: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler() {
        this.$nextTick(() => {
          this.initChart();
        });
      }
    }
  },
  data() {
    return {
      myChart: undefined
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      var chartDom = document.getElementById(this.id);
      var myChart = echarts.init(chartDom);
      var option;

      const lineHeight = 15;
      option = {
        series: [
          {
            // radius: '100%',
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: lineHeight,
                color: [
                  [0.3, "#67e0e3"],
                  [0.7, "#37a2da"],
                  [1, "#ed6a1b"]
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: "auto"
              }
            },

            splitLine: {
              lineStyle: {
                color: "#fff",
                width: 2
              },
              show: true,
              length: lineHeight,
              distance: -lineHeight
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              distance: lineHeight + 10,
              fontSize: 12,
              color: "#ffffff"
            },
            detail: {
              valueAnimation: true,
              formatter: "{value} %",
              color: this.value >= 70 ? "#C50B0B" : "white"
            },
            startAngle: 180,
            endAngle: 0,
            data: [
              {
                value: this.value
              }
            ]
          }
        ]
      };

      if (this.isRisk) {
        Object.assign(option.series[0], {
          radius: "130%",
          center: ["50%", "68%"]
        });
      }

      this.myChart = myChart;
      const that = this;

      window.addEventListener("resize", function() {
        that.$nextTick(() => {
          setTimeout(() => {
            that.myChart && that.myChart.resize();
          }, 1000);
        });
      });

      option && myChart.setOption(option);

      that.$nextTick(() => {
        myChart.resize();
      });
    }
  }
};
</script>
