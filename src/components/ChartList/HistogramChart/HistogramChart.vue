<template>
  <div class="chart w-full h-full" @mouseleave="hidden">
    <div :id="chartId" class="w-full h-full echart"></div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep, throttle, findIndex } from "lodash";
import * as echarts from "echarts";
export default {
  name: "HistogramChart",
  props: {
    // description: 图表的唯一ID, 必填
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true
    },
    // description: 图表中显示的线数据
    // example: [{
    //   max: 89.23,
    //   min: 17.73,
    //   name: "钻压",
    //   color: "#4ce791",
    //   unit: "kN",
    //   chartData: [
    //     60.87,
    //     23.76,
    //     20.64,
    //   ]
    //  }
    // ]
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
    // 特殊的线配置
    customSeriesData: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: "#4c25dd"
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
      const series = this.displayList.map((item, index) => {
        xAxis.push({
          type: "value",
          show: false
        });

        const chartData = isEmpty(this.depthLimit)
          ? cloneDeep(item.chartData).slice(foundMinIndex, foundMaxIndex)
          : item.chartData;

        return {
          xAxisIndex: index,
          symbol: "none",
          type: "bar",
          clip: false,
          barCategoryGap: -1,
          data: cloneDeep(chartData),
          stack: "Total",
          animationDuration: 0,
          animationEasingUpdate: "linear"
        };
      });

      const that = this;

      const chartDom = document.getElementById(this.chartId);
      let option = {
        yAxis: [
          {
            type: "category",
            data: cloneDeep(yAxisData),
            show: false,
            inverse: true
          }
        ],
        xAxis,
        series,
        // 共通配置
        grid: {
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        },
        tooltip: {
          trigger: "axis",
          position: function(pos, params, dom, rect, size) {
            const yPos = parseInt(pos[1]);
            if (yPos > size.viewSize[1] / 1.5) {
              return [0, yPos - 150];
            }
            return [0, yPos + 20];
          },
          axisPointer: {
            type: "shadow"
          },
          transitionDuration: 0
        },
        backgroundColor: this.chartBackground
      };

      // 共通 window变化 resize 配置

      const timer = setTimeout(() => {
        const chartDom = document.getElementById(this.chartId);
        if (!this.chart) this.chart = echarts.init(chartDom);
        this.chart && this.chart.setOption(option, true);
        clearTimeout(timer)
      }, 10);
      
      window.addEventListener("resize", function() {
        that.chart.resize();
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
