<template>
  <!-- <div class="w-full h-full"> -->

  <div style="width: 200px" class="h-full">
    <chart-header
      style="height: 200px"
      name="钻压"
      :maxValue="35"
      :minValue="12"
      unit="kN"
      name-color="#4c25dd"
    />
    <line-chart
      style="height: calc(100% - 220px)"
      class="mt-4"
      :depth="[1000, 1100, 1200, 1300, 1400, 1500]"
      :displayList="displayList"
      chartBackground="#000c37d9"
      chartId="cccc"
    />
  </div>
</template>

<script>
import ChartHeader from "../../../components/ChartList/ChartHeader/ChartHeader.vue";
import LineChart from "../../../components/ChartList/LineChart/LineChart.vue";
export default {
  name: "LineVisualizationChart",

  components: {
    ChartHeader,
    LineChart
  },
  data() {
    return {
      displayList: [
        {
          max: 50,
          min: 12,
          name: "钻压",
          color: "#4c25dd",
          unit: "kN",
          chartData: [12, 25, 30, 22, 15, 35, 14]
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
