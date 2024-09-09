<template>
  <div class="flex flex-column w-full h-full relative">
    <div :id="id" class="w-full flex-1"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { isEmpty, cloneDeep, slice } from "lodash";
export default {
  name: "WearStripChart",
  props: {
    id: {
      type: String,
      default: "WearStripChart"
    },
    height: {
      type: String,
      default: "290px"
    },
    chartData: {
      type: Array,
      default: 0
    },
    // description: 深度轴的区间
    // example: [3000, 4000]
    depthLimit: {
      type: Array,
      default: () => []
    },
    depth: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    chartData: {
      handler() {
        this.$nextTick(() => {
          this.initChart();
        });
      }
    },
    depthLimit: {
      handler() {
        this.$nextTick(() => {
          this.initChart();
        });
      },
      deep: true
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      var chartDom = document.getElementById(this.id);
      var myChart = echarts.init(chartDom);
      var option;
      let chartData;

      console.log(this.depthLimit)
      if (!isEmpty(this.depthLimit)) {
        const minIndex = this.depth.findIndex(
          item => item <= this.depthLimit[0]
        );
        const maxIndex = this.depth.findIndex(
          item => item >= this.depthLimit[1]
        );

        chartData = this.chartData.filter(
          (_, index) => index >= minIndex && index <= maxIndex
        );
      } else {
        chartData = cloneDeep(this.chartData);
      }

      const series = chartData.map(level => {
        const data = {
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series"
          },
          data: [
            {
              value: 1,
              itemStyle: {
                color: "#0D112A",
                borderColor: "#0D112A"
              }
            },
            {
              value: 1,
              itemStyle: {
                color: "#0D112A",
                borderColor: "#0D112A"
              }
            },
            {
              value: 1,
              itemStyle: {
                color: "#0D112A",
                borderColor: "#0D112A"
              }
            }
          ]
        };

        let color = "";
        if (level < 3) {
          color = "rgb(69, 226, 69)";
          data.data[0].itemStyle.color = color;
          data.data[0].itemStyle.borderColor = color;
        } else if (level < 6) {
          color = "yellow";
          data.data[1].itemStyle.color = color;
          data.data[1].itemStyle.borderColor = color;
        } else {
          color = "red";
          data.data[2].itemStyle.color = color;
          data.data[2].itemStyle.borderColor = color;
        }

        return data;
      });

      option = {
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0
        },
        xAxis: [
          {
            type: "category",
            data: ["0-2", "3-5", "6-8"],
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            inverse: true,
            type: "value",
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            max: series.length
          }
        ],
        series,
        backgroundColor: "#0D112A",
        animationDuration: 0
      };
      //linear-gradient(90deg,rgb(113 255 103) 0%, #f8ff01 50%, rgb(255 6 18) 100%)s
      option && myChart.setOption(option);
    },
    handleGetState(value) {
      let state = "";
      if (value <= 2) {
        state = "Normal";
      } else if (value <= 5) {
        state = "Warning";
      } else {
        state = "Criticel";
      }

      return state;
    }
  }
};
</script>
