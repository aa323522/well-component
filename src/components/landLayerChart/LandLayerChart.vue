<template>
  <div class="drillChart w-full h-full relative" @mouseleave="hidden">
    <div :id="chartId" class="w-full h-full"></div>
    <!--
      暂时隐藏，层级过多会导致重叠
      <div
      v-for="(item, index) in proportion"
      :key="index"
      class="absolute"
      :style="
        `top: ${getTop(index)}; left: 25px; pointer-events: none;color: black`
      "
    >
      {{ item.name }}
    </div> -->
  </div>
</template>

<script>
import { landLayerMapping, getColor } from "../../utils/utils.js";
import { isEmpty, throttle } from "lodash";

import * as echarts from "echarts";
export default {
  name: "LandLayerChart",
  props: {
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true
    },
    // description: 岩层结构 [{米数: 岩层名}]
    // example: [
    //  { horizonName: 'T2k', depth: 1000 },
    //  { horizonName: 'J1b', depth: 1100 }
    // ]
    //
    landLayerData: {
      type: Array
    },
    // description: 深度轴的区间
    // example: [3000, 4000]
    depthLimit: {
      type: Array,
      default: () => []
    },
    chartBackground: {
      default: "",
      type: String
    }
  },
  computed: {
    getTop() {
      return function(currentIndex) {
        if (this.proportion.length === 1) {
          return "50%";
        }

        let top = 0;

        this.proportion.forEach((item, index) => {
          if (index < currentIndex)
            top += (item.count / this.limitLength) * 100;

          if (index == currentIndex)
            top += ((item.count / this.limitLength) * 100) / 2;
        });

        // 减去 字体的高度
        return `calc(${top}% - 16px)`;
      };
    }
  },
  watch: {
    landLayerData: {
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
      // description: 层位的个数
      // example: {"T2k": 4,"N2d": 8,"J1b": 8}
      proportion: [],
      chart: undefined,
      // 用于层位的个数存储
      limitLength: 0,
      throttleInitChartFn: throttle(
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
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = echarts.init(chartDom);
      this.chart = myChart;
      let landLayerData;
      let minDepth;

      if (isEmpty(this.depthLimit) || this.depthLimit.length < 2) {
        landLayerData = this.landLayerData;
        // minDepth = this.landLayerData[0].depth;
      } else {
        landLayerData = this.landLayerData.filter(
          item =>
            item.depth >= this.depthLimit[0] && item.depth <= this.depthLimit[1]
        );

        minDepth = this.depthLimit[0];
      }
      // description: 图表层级堆叠信息
      // example: {
      //   T2k: 4,
      //   N2d: 8,
      //   J1b: 8
      // }

      if (landLayerData.length > 1) {
        // Object.keys 会打乱顺序，所以需要重排一下层级对象
        const layerList = [];
        const countList = [];
        let preName = "";
        landLayerData.forEach((item, index) => {
          if (item.horizonName !== preName) {
            layerList.push(item.horizonName);
            preName = item.horizonName;
            index !== 0 && countList.push(index);
          }
        });

        const layerSetting = [];

        countList.sort((a, b) => {
          layerSetting.push(Math.abs(a - b));
        });

        const count = [
          countList[0],
          ...layerSetting,
          landLayerData.length - countList[countList.length - 1]
        ];

        this.proportion = layerList
          .map((item, index) => {
            return { name: item, count: count[index] };
          })
          .reverse();
      } else {
        this.proportion = landLayerData.length
          ? [{ name: landLayerData[0].horizonName, count: 1 }]
          : [];
      }

      this.limitLength = landLayerData.length;
      const series = landLayerData.map((item, index) => {
        return {
          name: item.horizonName,
          type: "bar",
          stack: "Total",
          label: false,
          z: index,
          itemStyle: {
            borderColor: landLayerMapping[item.horizonName].color
          },
          color: landLayerMapping[item.horizonName]
            ? landLayerMapping[item.horizonName].color
            : undefined,
          data: [item.depth]
        };
      });
      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        xAxis: {
          type: "category",
          show: false,
          data: [""]
        },
        tooltip: {
          showDelay: 0,
          width: 100,
          // trigger: "axis",
          // extraCssText: 'width:9rem;',
          // axisPointer: { axis: 'y' },
          position: function(pos, params, dom, rect, size) {
            const y = rect.y < 550 ? rect.y + 20 : rect.y - 30;
            return [0, y];
          },
          formatter: data => {
            const dataIndex = data.componentIndex;

            const chartELements = document.getElementsByClassName("echart");
            const count = chartELements.length;
            for (let i = 0; i < count; i++) {
              if (chartELements[i]) {
                const chartData = echarts.init(chartELements[i]);
                chartData.dispatchAction({
                  type: "showTip",
                  dataIndex,
                  seriesIndex: 0
                });
              }
            }
            return `<div style="font-weight: bold;">${data.marker} ${data.seriesName}</div>`;
          },
          transitionDuration: 0
        },
        yAxis: {
          type: "value",
          show: false,
          // min: minDepth,
          splitNumber: 200,
          inverse: true
        },
        series: series.reverse()
      };
      // options 为echart 的配置
      option && myChart.setOption(option, { notMerge: true });
      myChart.resize();

      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    hidden() {
      // TODO 等单井的OK了，修改为动态的

      const chartELements = document.getElementsByClassName("echart");
      const count = chartELements.length;
      for (let i = 0; i < count; i++) {
        if (chartELements[i]) {
          const chartData = echarts.init(chartELements[i]);
          chartData.dispatchAction({
            type: "hideTip"
          });
        }
      }
    }
  }
};
</script>
