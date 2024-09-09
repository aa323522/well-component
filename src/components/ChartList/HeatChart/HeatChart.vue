<template>
  <div class="chart w-full h-full">
    <div :id="chartId" class="w-full h-full echart"></div>
  </div>
</template>

<script>
import { isEmpty, round, min, max, uniq } from "lodash";
import * as echarts from "echarts";

export default {
  name: "HeatChart",
  props: {
    // description: 图表的背景颜色
    // example: 'red'
    chartBackground: {
      default: "",
      type: String
    },
    chartId: {
      type: String,
      default: ""
    },
    mapData: {
      type: Array,
      default: () => []
    },
    // 选择的具体图的类型
    selectType: {
      type: String
    }
  },
  data() {
    return { chart: undefined };
  },
  mounted() {
    this.init();
  },
  watch: {
    mapData: {
      handler() {
        this.init();
      },
      deep: true,
      immediate: true
    },
    selectType: {
      handler() {
        this.init();
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    init() {
      if (isEmpty(this.mapData)) return;

      const valueList = [];

      let xData = [];
      let yData = [];
      let data = this.mapData.map(item => {
        const value = round(item[2]);
        valueList.push(value);

        const x = round(item[0]);
        const y = round(item[1]);
        xData.push(x);
        yData.push(y);

        return [x, y, value];
      });

      xData = uniq(xData).sort((pre, next) => pre - next);
      yData = uniq(yData).sort((pre, next) => pre - next);

      const seriesData = data.map(item => {
        return [
          xData.findIndex(x => x === item[0]),
          yData.findIndex(y => y === item[1]),
          item[2]
        ];
      });



      const minValue = min(valueList);
      const maxValue = max(valueList);
      // prettier-ignore
      const option = {
        tooltip: {
          show: false,
        },
        grid: {
          bottom: 60,
          left: 20,
          backgroundColor: "#0D112A",
          show: true
        },
        xAxis: {
          type: "category",
          data: xData,
          // min: min(xData),
          // max: max(xData),
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          axisLabel: {
            show: true,
            fontSize: 18
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: yData,
          // min: min(yData),
          // max: max(yData),
          name: "转盘转速(RPM)/钻压(tone)",
          nameLocation: "end",
          nameTextStyle: {
            fontSize: 20,
            padding: [0, 150, -5, 0]
          },
          axisLabel: {
            show: true,
            fontSize: 18
          },
          position: "right",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          axisLine: {
            lineStyle: {
              color: "white"
            }
          },
          axisTick: {
            show: false
          }
        },
        visualMap: {
          min: minValue,
          max: maxValue,
          calculable: true,
          realtime: false,
          inRange: {
            color: ["#f7ff8e", "#f78f0a", "#f7430a"]
          },
          orient: "horizontal",
          top: 0,
          left: 10,
          text: this.selectType == '机械钻速' ? [`${maxValue}m/h`, `${minValue}m/h`] : [`${maxValue}MPa`, `${minValue}MPa`],
          textGap: 30,
          textStyle: {
            color: "rgba(6, 222, 255, 1)",
            fontSize: 20
          }
        },
        series: [
          {
            name: "模块名",
            type: "heatmap",
            data: seriesData,
            grid: {
              left: "20px"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };


      const timer = setTimeout(() => {
        const chartDom = document.getElementById(this.chartId);
        if (!this.chart) this.chart = echarts.init(chartDom);
        option && this.chart.setOption(option);
        this.chart && this.chart.setOption(option, true);
        clearTimeout(timer)
      }, 10);

      
      const that = this;
      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.$nextTick(() => {
            that.chart && that.chart.resize();
          })
        }, 1000);
      });
    }
  }
};
</script>
