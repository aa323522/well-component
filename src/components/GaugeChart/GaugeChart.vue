<template>
  <div class="chart w-full h-full relative">
    <div class="absolute right-4 top-4">
      <div>
        <span class="text-10">单位: {{ unit }}</span>
      </div>
    </div>
    <div :id="chartId" class="w-full h-full echart"></div>
    <div class="absolute bottom-0 w-full flex align-center flex-column">
      <div>
        <div class="flex gap-x-1 align-center">
          <div style="width:20px;height: 20px;background:#4ff4fe"></div>
          <div>
            <span class="text-24"
              >实际{{ unit == "tone" ? "钻压" : "转速" }}</span
            >
          </div>
          <div>
            <span style="color: #4ff4fe" class="text-24"
              >{{ round(realityData) }}{{ unit }}</span
            >
          </div>
        </div>
        <div class="flex gap-x-1 align-center">
          <div style="width:20px;height: 20px;background:#4273ea"></div>
          <div>
            <span class="text-24"
              >推荐{{ unit == "tone" ? "钻压" : "转速" }}</span
            >
          </div>
          <div>
            <span style="color: #4273ea" class="text-24"
              >{{ round(recommendedData) }}{{ unit }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { round } from "lodash";
export default {
  name: "Chart",
  props: {
    // description: 图表的唯一ID, 必填
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true
    },
    unit: {
      type: String
    },
    realityData: {
      type: Number
    },
    recommendedData: {
      type: Number
    }
  },
  watch: {
    realityData: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true
    },
    recommendedData: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true
    }
  },
  data() {
    return {
      round,
      chart: undefined
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var chartDom = document.getElementById(this.chartId);
      if (this.chart === undefined) this.chart = echarts.init(chartDom);


      var option;

      option = {
        series: [
          {
            radius: "100%",
            z: 1,
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "65%"],
            progress: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: [[1, "white"]],
                width: 2
              }
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
            pointer: {
              show: false
            }
          },
          {
            radius: "95%",
            Z: 2,
            splitNumber: 3,
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            max: this.unit == "tone"  ? 30 : 150,
            center: ["50%", "65%"],
            progress: {
              show: true,
              overlap: false,
              clip: false,
              itemStyle: {
                color: "#4ff4fe"
              }
            },
            axisLine: {
              lineStyle: { color: [[1, "#0D112A"]], width: 20 }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              color: "white",
              fontSize: 20,
              distance: -70,
              padding: 0,
              formatter: function (value, e2) {
                if (value === 83.3333333333) return 85
                if (value === 166.6666666667) return 170

                return value
              }
            },
            data: [
              {
                value: this.realityData
              }
            ],
            pointer: {
              show: false
            },
            detail: {
              show: false
            }
          },
          {
            radius: "75%",
            z: 1,
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "65%"],
            progress: {
              show: true,
              overlap: false,
              width: 20,
              itemStyle: {
                color: "#4273ea",
                borderWidth: 13.5,
                borderType: "dashed",
                borderCap: "square"
              }
            },
            axisLine: {
              lineStyle: {
                color: [[1, "#0D112A"]],
                width: 20
              }
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
            max: this.unit == "tone"  ? 30 : 150,
            data: [
              {
                value: this.recommendedData
              }
            ],
            pointer: {
              show: true
            },
            detail: {
              show: false
            }
          },
          {
            radius: "55%",
            z: 1,
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "65%"],
            progress: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: [[1, "white"]],
                width: 2
              }
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
            pointer: {
              show: false
            }
          }
        ]
      };

      option && this.chart.setOption(option);
      const that = this;
      
      this.chart && this.chart.setOption(option, true);
 
      window.addEventListener("resize", function() {
        that.$nextTick(() => {
        setTimeout(() => {
            that.chart && that.chart.resize();
          }, 1000);
        });
      });
    }
  }
};
</script>
