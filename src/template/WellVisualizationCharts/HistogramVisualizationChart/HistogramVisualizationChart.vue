<template>
  <!-- <div class="w-full h-full"> -->

  <div style="width: 200px" class="h-full">
    <chart-header
      style="height: 200px"
      name="钻速"
      :maxValue="20"
      :minValue="0"
      unit="rpm"
      name-color="rgb(118 132 243)"
    />
    <histogram-chart
      style="height: calc(100% - 220px)"
      class="mt-4 h-full"
      :depth="[1000, 1100, 1200, 1300, 1400, 1500, 1600]"
      :displayList="displayList"
      chartBackground="rgb(0 12 55)"
      chartId="cccc"
    />
  </div>
</template>

<script>
import ChartHeader from "../../../components/ChartList/ChartHeader/ChartHeader.vue";
import HistogramChart from "../../../components/ChartList/HistogramChart/HistogramChart.vue";
export default {
  name: "HistogramVisualizationChart",

  components: {
    ChartHeader,
    HistogramChart
  },
  data() {
    return {
      displayList: [
        {
          max: 70,
          min: 0,
          name: "钻速",
          color: "#4ce791",
          unit: "kN",
          chartData: [10, 13, 13, 14, 20, 15, 14]
        }
      ]
    };
  },
  mounted() {
    // Object.keys(wellDepthData).map(item => parseFloat(item))
  },
  methods: {}
};
</script>

<style></style>
