<template>
  <div class="chart w-full h-full">
    <div :id="chartId" class="w-full h-full echart"></div>
  </div>
</template>

<script>
import {
  isEmpty,
  cloneDeep,
  findIndex,
  isNumber,
  debounce,
  isObject,
  min,
  max,
  floor
} from "lodash";
import * as echarts from "echarts";
import { getColor } from "../../utils/utils";
export default {
  name: "Chart",
  props: {
    // 多个图标联动的分组Id，默认开启联动（lineGroupId），如不希望联动可分别设置对应的id，如传递下方的chartId
    groupId: {
      default: "lineGroupId",
      type: String
    },
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
    // 特殊竖轴配置
    customYAxis: {
      type: Object,
      default: () => {}
    },
    // 特殊外部配置
    customOptions: {
      type: Object,
      default: () => {}
    },
    tooltipUnit: {
      type: String,
      default: "m"
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
          this.debounceInitChartFn();
        });
      },
      deep: true
    }
  },
  data() {
    return {
      chart: undefined,
      debounceInitChartFn: debounce(
        function() {
          this.init();
        },
        200,
        {
          leading: false, //指定调用在节流开始前
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
        this.depthLimit[0] <= this.depthLimit[1]
      ) {
        foundMinIndex = findIndex(
          depth,
          item =>
            (isObject(item)
              ? isNumber(item.value)
                ? item.value
                : item.depth
              : item) >= this.depthLimit[0]
        );
        foundMaxIndex =
          findIndex(
            depth,
            item =>
              (isObject(item)
                ? isNumber(item.value)
                  ? item.value
                  : item.depth
                : item) >= this.depthLimit[1]
          ) + 1;

        yAxisData = cloneDeep(depth).slice(foundMinIndex, foundMaxIndex);
      }

      const xAxis = [];
      const series = [];
      let gradientMinValue;
      let gradientMaxValue;
      let gradientIndex;

      this.displayList.forEach((item, index) => {
        xAxis.push({
          type: "value",
          show: false,
          min: item.minValue !== undefined ? item.minValue : "dataMin",
          max: item.maxValue !== undefined ? item.maxValue : null
        });

        const chartData = isEmpty(this.depthLimit)
          ? cloneDeep(item.chartData).slice(foundMinIndex, foundMaxIndex)
          : item.chartData;

        const color = item.color ? item.color : getColor(index) || "red";
        if (item.name == "声波时差") {
          gradientIndex = index;
          gradientMinValue = min(chartData);
          gradientMaxValue = max(chartData);
          series.push(
            ...[
              {
                xAxisIndex: index,
                symbol: "none",
                type: "line",
                clip: false,
                data: cloneDeep(chartData),
                step: "middle",
                symbol: "none",
                animationDuration: 0
              },
              {
                xAxisIndex: index,
                smooth: 0.6,
                type: "bar",
                clip: false,
                data: cloneDeep(chartData),
                animationDuration: 0,
                barCategoryGap: -1
              }
            ]
          );

          return;
        }

        series.push({
          xAxisIndex: index,
          symbol: "none",
          smooth: 0.6,
          type: "line",
          clip: false,
          lineStyle: {
            width: 2,
            type: item.lineType ? item.lineType : "solid",
            color
          },
          data: cloneDeep(chartData),
          animationDuration: 0
        });
      });

      const that = this;

      const chartDom = document.getElementById(this.chartId);

      if (!this.chart) this.chart = echarts.init(chartDom);
      let option = {
        yAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: cloneDeep(yAxisData),
            show: false,
            inverse: true,
            ...this.customYAxis
          }
        ],
        xAxis,
        series,
        // 共通配置
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          position: function(pos, params, dom, rect, size) {
            const yPos = parseInt(pos[1]);
            if (yPos > size.viewSize[1] / 1.5) {
              return [0, yPos - 150];
            }
            return [0, yPos + 20];
          },
          transitionDuration: 0,
          formatter: data => {
            // const { dataIndex } = data[0];

            // const chartELements = document.getElementsByClassName("echart");
            // const count = chartELements.length;
            // for (let i = 0; i < count; i++) {
            //   if (chartELements[i]) {
            //     const chartData = echarts.init(chartELements[i]);
            //     chartData.dispatchAction({
            //       type: "showTip",
            //       dataIndex,
            //       seriesIndex: 0
            //     });
            //   }
            // }
            const mark = data.map((item, index) => {
              const hasData = this.displayList[index] !== undefined;
              return (
                `
                  ${
                    index === 0
                      ? `<div style="font-size:1.25rem">${item.name} ${this.tooltipUnit}</div>`
                      : ""
                  }
              ` +
                (hasData
                  ? `
                  <div class="flex align-center gap-x-2" style="width:9rem">
                  <div class="radius-full" style="background: ${
                    this.displayList[index].color
                      ? this.displayList[index].color
                      : getColor(index)
                  };width: 8px;height:8px"></div>
                  <div style="font-weight: bold;">${
                    this.displayList[index].name
                  }:</div>
                  </div>
                   <span style="font-weight: bold;">${floor(
                     item.value,
                     2
                   )}</span>
                  <span style="font-weight: bold;">${
                    this.displayList[index].unit
                  }</span>`
                  : "")
              );
            });
            const tooltipValue = mark.join("<br/>");
            return `<div>${tooltipValue}</div>`;
          }
        },
        backgroundColor: this.chartBackground,
        ...this.customOptions
      };

      if (gradientIndex !== undefined) {
        Object.assign(option, {
          visualMap: {
            show: false,
            dimension: 0,
            max: gradientMaxValue,
            min: gradientMinValue,
            inRange: {
              color: ["#04cc04", "#e51505"]
            }
          }
        });
      }

      // 共通 window变化 resize 配置
      this.chart && this.chart.setOption(option, true);

      this.chart.group = this.groupId;
      echarts.connect(this.groupId);
      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart && that.chart.resize();
        }, 1000);
      });
    },
  }
};
</script>
