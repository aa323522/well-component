<template>
  <div class="chart w-full h-full flex">
    <div :id="chartId" class="w-full h-full echart flex-1"></div>
    <div class="flex flex-column justify-evenly mr-4">
      <div class="flex gap-x-1">
        <div
          style="width:12px;height: 12px;background:#4ff4fe;marginTop: 8px "
        ></div>
        <div>
          <div>
            <span class="text-lg font-color">{{
              type === "mse" ? "实际机械比能" : "实际机械钻速"
            }}</span>
          </div>
          <div>
            <span style="color: #4ff4fe" class="text-24"
              >{{ type === "mse" ? round(realityData) : realityData
              }}{{ unit }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex gap-x-1">
        <div
          style="width:12px;height: 12px;background:#4273ea;marginTop: 8px "
        ></div>
        <div>
          <div>
            <span>
              <span class="text-lg font-color">{{
                type === "mse" ? "优化机械比能" : "优化机械钻速"
              }}</span></span
            >
          </div>
          <div>
            <span style="color: #4273ea" class="text-24"
              >{{ type === "mse" ? round(recommendedData) : recommendedData
              }}{{ unit }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { round } from "lodash";
import * as echarts from "echarts";
import { getColor } from "../../utils/utils";
export default {
  name: "Chart",
  props: {
    // description: 图表的唯一ID, 必填
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true
    },
    // 优化效果，分为比能(mse)和钻速(rotateRpm)
    type: {
      type: String
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
      deep: true,
      immediate: true
    },
    recommendedData: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      round: round,
      chart: undefined
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 共通 window变化 resize 配置
      var chartDom = document.getElementById(this.chartId);

      if (this.chart === undefined) {
        this.chart = echarts.init(chartDom);
      }
      var option;

      option = {
        grid: {
          top: 10,
          left: 70,
          bottom: 20,
          right: 40
        },
        xAxis: {
          type: "category",
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          axisLabel: { fontSize: 16 },
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            barWidth: 40,
            data: [
              {
                itemStyle: {
                  color: "#4ff4fe"
                },
                value: this.realityData
              },
              {
                itemStyle: {
                  color: "#4273ea"
                },
                value: this.recommendedData
              }
            ],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "#0D112A"
            },
            barCategoryGap: "0%"
          }
        ]
      };

      const that = this;
      
      this.chart && option && this.chart.setOption(option);
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
