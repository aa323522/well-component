<template>
  <div class="chart w-full h-full">
    <div :id="chartId" :class="`w-full h-full lineEchart ${chartName}`"></div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep, throttle, findIndex, floor } from "lodash";
import * as echarts from "echarts";
export default {
  name: "LineChart",
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
    chartName: {
      default: "echart",
      type: String
    },
    showLegend: {
      default: false,
      type: Boolean
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
    customChartData: {
      type: Object,
      default: () => {}
    },
    // 特殊的线配置
    customSeriesData: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default: "#4c25dd"
    },
    chartZoomStart: {
      type: Number,
      default: 100
    },
    chartZoomEnd: {
      type: Number
    },
    setChartZoomStart: {
      type: Function
    },
    setChartZoomEnd: {
      type: Function
    },
    bitDepthList: {
      type: Array,
      default: () => []
    },
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
          show: false,
          min: item.min ? item.min : "dataMin",
          max: item.max ? item.max : null
        });

        const chartData = isEmpty(this.depthLimit)
          ? cloneDeep(item.chartData).slice(foundMinIndex, foundMaxIndex)
          : item.chartData;

        return {
          xAxisIndex: index,
          symbol: "none",
          smooth: 0.6,
          type: "line",
          clip: false,
          lineStyle: {
            width: 2,
            type: item.lineType ? item.lineType : "solid",
            color: item.color
          },
          itemStyle: {
            color: item.color
          },
          name: item.name,
          large: true,
          largeThreshold: 100,
          data: cloneDeep(chartData),
          animationEasingUpdate: "linear",
          // 折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。
          // sampling: "lttb",
          ...this.customSeriesData
        };
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
            inverse: true
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
        dataZoom: [
          {
            orient: "vertical",
            show: false, //是否显示滑动条，不影响使用
            type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: this.chartZoomStart,
            end: this.chartZoomEnd,
            showDataShadow: false, //是否显示数据阴影 默认auto
            backgroundColor: "#fff",
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: false, //是否实时更新
            filterMode: "filter",
            maxValueSpan: 500,
            minValueSpan: 500,
            brushSelect: false
          },
          {
            orient: "vertical",
            type: "inside",
            zoomOnMouseWheel: false, //滚轮是否触发缩放
            moveOnMouseMove: true, //鼠标滚轮触发滚动
            moveOnMouseWheel: true
          }
        ],
        ...(this.showLegend
          ? {
              legend: {
                data: this.displayList.map(item => item.name),
                right: 0,
                textStyle: {
                  color: "while"
                }
              }
            }
          : {}),
        tooltip: {
          trigger: "axis",
          extraCssText: "width:9rem;",
          position: function(pos, params, dom, rect, size) {
            const yPos = parseInt(pos[1]);
            if (yPos > size.viewSize[1] / 1.5) {
              return [0, yPos - 250];
            }
            return [0, yPos + 20];
          },
          transitionDuration: 0,
          formatter: data => {
            console.log(data)


            const mark = data.map((item, index) => {
              
            const displayTitle = this.bitDepthList.length - 1 >= item.dataIndex ? this.bitDepthList[item.dataIndex] : item.name
              const hasData = this.displayList[index] !== undefined;
              return (
                `
                  ${
                    index === 0
                      ? `<div style="font-size:1.25rem">${
                        displayTitle
                        } ${"m"}</div>`
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

        animationDuration: 300,
        animationDurationUpdate: 100,
        backgroundColor: this.chartBackground,
        ...this.customChartData
      };

      // 共通 window变化 resize 配置
      option && this.chart.setOption(option);

      const setZoom = (start, end) => {
        that.setChartZoomStart(start);
        that.setChartZoomEnd(end);
      };
      this.chart.on("datazoom", function(params) {
        setZoom(params.batch[0].start, params.batch[0].end);
      });

      this.chart.group = this.groupId;
      echarts.connect(this.groupId);

      window.addEventListener("resize", function() {
        setTimeout(() => {
          that.chart && that.chart.resize();
        }, 1000);
      });
    }
  }
};
</script>
