<template>
  <div class="flex flex-column w-full h-full relative">
    <div :id="id" class="w-full flex-1"></div>
    <div class="absolute bottom-0 text-lg w-full">
      <div class="flex w-full justify-between px-4">
        <div :style="`color: ${colorObj.Normal}`">
          <div><span>0-2</span></div>
          <div><span>Normal</span></div>
        </div>
        <div :style="`color: ${colorObj.Warning}`">
          <div><span>3-6</span></div>
          <div><span>Warning</span></div>
        </div>
        <div :style="`color: ${colorObj.Critical}`">
          <div><span>6-8</span></div>
          <div><span>Critical</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "wornDialChart",
  props: {
    id: {
      type: String,
      default: "wornDialChart"
    },
    height: {
      type: String,
      default: "290px"
    },
    value: {
      type: Number,
      default: 0
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
      colorObj: {
        Normal: "#45e245",
        Warning: "yellow",
        Critical: "red"
      },
      chart: undefined
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      var chartDom = document.getElementById(this.id);
      if (this.chart == undefined) this.chart = echarts.init(chartDom);
      var option;

      const lineHeight = 20;
      const that = this;
      const state = this.handleGetState(this.value);

      option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        series: [
          {
            splitNumber: 4,
            max: 8,
            min: 0,
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: lineHeight,
                color: [
                  [0.3, this.colorObj.Normal],
                  [0.7, this.colorObj.Warning],
                  [1, this.colorObj.Critical]
                ]
              }
            },
            pointer: {
              width: 4,
              itemStyle: {
                color: "auto"
              }
            },

            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              distance: -50,
              color: "white",
              fontSize: 20
            },
            detail: {
              valueAnimation: true,
              formatter: value => {
                return `${value}\n${state}`;
              },
              color: this.colorObj[state],
              fontSize: 20
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
      window.addEventListener("resize", function() {
        that.$nextTick(() => {
        setTimeout(() => {
            that.chart && that.chart.resize();
          }, 1000);
        });
      });

      that.chart && option && that.chart.setOption(option);
    },
    handleGetState(value) {
      let state = "";
      if (value <= 3) {
        state = "Normal";
      } else if (value <= 6) {
        state = "Warning";
      } else {
        state = "Criticel";
      }

      return state;
    }
  }
};
</script>
