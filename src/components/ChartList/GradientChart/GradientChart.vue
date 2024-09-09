<template>
  <div class="chart w-full h-full" @mouseleave="hidden">
    <div :id="chartId" class="w-full h-full echart"></div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep, throttle, findIndex, min, max } from "lodash";
import * as echarts from "echarts";
export default {
  name: "GradientChart",
  props: {
    // description: 图表的唯一ID, 必填
    chartId: {
      default: "GradientChart",
      type: String,
      required: true
    },
    displayList: {
      type: Array,
      default: () => []
    },
    // description: 图表中Y轴深度数组
    // example: [1000, 2000 ,3000]
    depth: {
      type: Array,
      default: () => [],
      required: true
    },
    // description: 图表的背景颜色
    // example: 'red'
    chartBackground: {
      default: "",
      type: String
    },
    // description: 深度轴的区间
    // example: [3000, 4000]
    depthLimit: {
      type: Array,
      default: () => []
    },
    customChartData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    displayList: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true,
      immediate: true
    },
    depthLimit: {
      handler() {
        // 监听 depthLimit 变量，即深度轴的变化，以便重新渲染 chart
        this.$nextTick(() => {
          this.throttleInitChartFn();
        });
      },
      deep: true
    }
  },
  data() {
    return {
      chart: undefined,
      throttleInitChartFn: throttle(
        function() {
          this.init();
        },
        300,
        {
          leading: true, //指定调用在节流开始前
          trailing: true //指定调用在节流结束后,
        }
      )
    };
  },
  methods: {
    init() {
      const depth = cloneDeep(this.depth);
      if (isEmpty(this.displayList) || isEmpty(depth)) return;

      let yAxisData = depth ? depth : [];
      let foundMinIndex = 0;
      let foundMaxIndex = yAxisData.length;

      // 判断深度是否存在，且是一个区间
      if (
        this.depthLimit &&
        this.depthLimit.length === 2 &&
        this.depthLimit[0] < this.depthLimit[1]
      ) {
        foundMinIndex = findIndex(depth, item => item >= this.depthLimit[0]);
        foundMaxIndex =
          findIndex(depth, item => item >= this.depthLimit[1]) + 1;
        yAxisData = cloneDeep(depth).slice(foundMinIndex, foundMaxIndex);
      }

      const xAxis = [];
      const sourceData = this.displayList.map((item, index) => {
        const chartData = isEmpty(this.depthLimit)
          ? cloneDeep(item.chartData).slice(foundMinIndex, foundMaxIndex)
          : item.chartData;

        return chartData;
      });

      const minValue = min(sourceData[0]);
      const maxValue = max(sourceData[0]);

      const source = yAxisData.map((item, index) => {
        return [sourceData[0][index], item];
      });

      source.unshift(["amount", "product"]);

      const that = this;

      const chartDom = document.getElementById(this.chartId);

      if (!this.chart) this.chart = echarts.init(chartDom);
      let option = (option = {
        dataset: {
          source
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        xAxis: { name: "amount", show: false },
        yAxis: { type: "category", boundaryGap: false, inverse: true },
        visualMap: {
          show: false,
          dimension: 0,
          inRange: {
            color: ["#04cc04", "#e51505"]
          },
          min: minValue,
          max: maxValue
        },
        series: [
          {
            barCategoryGap: -1,
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product"
            }
          },
          {
            type: "line",
            smooth: 1,
            smoothMonotone: "y",
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product"
            },
            step: "middle",
            lineStyle: {
              color: "rgba(42, 255, 0, 1)",
              width: 5
            },
            symbol: "none"
          }
        ],

        backgroundColor: this.chartBackground
      });

      // 共通 window变化 resize 配置
      option && this.chart.setOption(option);
      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart && that.chart.resize();
        }, 1000);
      });
    },
    hidden() {
      // TODO 等单井的OK了，修改为动态的
      const chart1 = echarts.init(document.getElementById("chartId1"));
      const chart2 = echarts.init(document.getElementById("chartId2"));
      const chart3 = echarts.init(document.getElementById("chartId3"));
      const drillChartDom = document.getElementById("drillChart");
      if (drillChartDom) {
        const drillChart = echarts.init(drillChartDom);
        drillChart.dispatchAction({
          type: "hideTip"
        });
      }
      this.$nextTick(() => {
        chart1.dispatchAction({
          type: "hideTip"
        });
        chart2.dispatchAction({
          type: "hideTip"
        });
        chart3.dispatchAction({
          type: "hideTip"
        });
      });
    }
  }
};
</script>
