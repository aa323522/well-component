<template>
  <div class="grid grid-cols-3 gap-x-2">
    <div class="flex flex-column">
      <span style="fontSize: 24px">钻压(kN)</span>
      <LineChart
        showLegend
        chartName="modalchart"
        :depth="depth"
        :displayList="displayList"
        chartBackground="#000c37d9"
        groupId="modalChartGroup"
        chartId="modalChart01"
        :chartZoomStart="chartZoomStart"
        :chartZoomEnd="chartZoomEnd"
        :setChartZoomStart="setChartZoomStart"
        :setChartZoomEnd="setChartZoomEnd"
      />
    </div>
    <div class="flex flex-column">
      <span style="fontSize: 24px">转速(rpm)</span>
      <LineChart
        showLegend
        chartName="modalchart"
        :depth="depth"
        :displayList="displayList2"
        chartBackground="#000c37d9"
        groupId="modalChartGroup"
        chartId="modalChart02"
        :chartZoomStart="chartZoomStart"
        :chartZoomEnd="chartZoomEnd"
        :setChartZoomStart="setChartZoomStart"
        :setChartZoomEnd="setChartZoomEnd"
      />
    </div>
    <div class="flex flex-column">
      <span style="fontSize: 24px">出口流量(L/m)</span>
      <LineChart
        showLegend
        chartName="modalchart"
        :depth="depth"
        :displayList="displayList3"
        chartBackground="#000c37d9"
        groupId="modalChartGroup"
        chartId="modalChart03"
        :chartZoomStart="chartZoomStart"
        :chartZoomEnd="chartZoomEnd"
        :setChartZoomStart="setChartZoomStart"
        :setChartZoomEnd="setChartZoomEnd"
      />
    </div>
  </div>
</template>
<script>
import LineChart from "@/components/ChartList/LineChart/LineChart.vue";

import { max, min } from "lodash";
export default {
  name: "ModalChart",
  props: {
    processedData: {
      type: Array,
      default: []
    },
    modalUpdateOriginData: {
      type: Array,
      default: []
    },
    selectedDepth: {
      type: Number
    },
    depthList: {
      type: Array,
      default: []
    }
  },
  watch: {
    processedData: {
      handler() {
        const depthBeforeData = this.modalUpdateOriginData.filter(
          item => item.wellDepth <= this.selectedDepth
        );
        // console.log(
        //   this.modalUpdateOriginData.filter(
        //     item => item.wellDepth <= this.selectedDepth
        //   ),
        //   this.processedData,
        //   this.selectedDepth
        // );

        const chartData = this.processedData.map(item => {
          const beforeData = depthBeforeData.find(data => {
            return data.wellDepth == parseInt(item.WELL_DEPTH);
          });
          if (!beforeData) return;

          return {
            preWob: beforeData.wob,
            preRotateSpeed: beforeData.rotateSpeed,
            preFlowOut: beforeData.flowOut,
            nextWob: item.WOB,
            nextRotateSpeed: item.ROTATE_SPEED,
            nextFlowOut: item.FLOW_OUT,
            depth: item.WELL_DEPTH
          };
        });

        const filterData = chartData.filter(item => item);

        const placeHolderList = [];
        this.depth = [
          ...filterData.map(item => item.depth)
          // ...placeHolderList
        ];

        const preWob = filterData.map(item => item.preWob);
        const nextWob = filterData.map(item => item.nextWob);

        this.displayList = [
          {
            name: "处理前",
            color: "#95f202",
            unit: "kN",
            chartData: preWob
          },
          {
            name: "处理后",
            color: "red",
            unit: "kN",
            chartData: nextWob
          }
        ];

        const preRotateSpeed = filterData.map(item => item.preRotateSpeed);
        const nextRotateSpeed = filterData.map(item => item.nextRotateSpeed);
        this.displayList2 = [
          {
            name: "处理前",
            color: "#95f202",
            unit: "rpm",
            chartData: preRotateSpeed
          },
          {
            name: "处理后",
            color: "red",
            unit: "rpm",
            chartData: nextRotateSpeed
          }
        ];

        const preFlowOut = filterData.map(item => item.preFlowOut);
        const nextFlowOut = filterData.map(item => item.nextFlowOut);

        this.displayList3 = [
          {
            name: "处理前",
            color: "#95f202",
            unit: "L/m",
            chartData: preFlowOut
          },
          {
            name: "处理后",
            color: "red",
            unit: "L/m",
            chartData: nextFlowOut
          }
        ];
      },
      deep: true,
      immediate: true
    }
  },
  components: { LineChart },
  computed: {},
  data() {
    return {
      displayList: [],
      displayList2: [],
      displayList3: [],
      depth: [],
      chartZoomStart: 100,
      chartZoomEnd: undefined
    };
  },
  methods: {
    setChartZoomStart(value) {
      this.chartZoomStart = value;
    },
    setChartZoomEnd(value) {
      this.chartZoomEnd = value;
    }
  }
};
</script>

<style lang="less"></style>
