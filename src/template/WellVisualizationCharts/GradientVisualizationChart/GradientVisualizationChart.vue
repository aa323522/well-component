<template>
  <!-- <div class="w-full h-full"> -->

  <div style="width: 200px" class="h-full">
    <chart-header
      style="height: 200px"
      name="机械钻速"
      :maxValue="5"
      :minValue="1"
      unit="m/h"
      name-color="linear-gradient(90deg,  #04cc04 0%, #e51505 100%)"
    />
    <gradient-chart
      style="height: calc(100% - 220px)"
      class="mt-4"
      :depth="[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800]"
      :displayList="displayList"
      chartBackground="#000c37d9"
      chartId="cccc"
      :customChartData="this.customChartData"
      :customSeriesData="this.customSeriesData"
    />
  </div>
</template>

<script>
import ChartHeader from "../../../components/ChartList/ChartHeader/ChartHeader.vue";
import GradientChart from "../../../components/ChartList/GradientChart/GradientChart.vue";
export default {
  name: "GradientVisualizationChart",
  components: {
    ChartHeader,
    GradientChart
  },
  data() {
    return {
      displayList: [
        {
          max: 13,
          min: 10,
          name: "机械钻速",
          color: "#4ce791",
          unit: "m/h",
          chartData: [1, 2, 4, 4, 3, 5, 4, 3, 1]
        }
      ],
      customChartData: {},
      customSeriesData: {
        areaStyle: {},
        lineStyle: {
          width: 0
        }
      }
    };
  },
  mounted() {
    // Object.keys(wellDepthData).map(item => parseFloat(item))
  },
  methods: {}
};
</script>

<style></style>
