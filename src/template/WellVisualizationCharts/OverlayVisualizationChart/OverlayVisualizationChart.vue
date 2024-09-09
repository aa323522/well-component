<template>
  <!-- <div class="w-full h-full"> -->

  <div style="width: 200px" class="h-full">
    <chart-header
      header-type="overlay"
      :color-list="displayList.map(item => item.color)"
      style="height: 200px"
      name="体积矿物"
      unit="%"
      :maxValue="100"
      :minValue="0"
      name-color="rgb(143 121 225)"
    />
    <overlay-chart
      style="height: calc(100% - 220px)"
      class="mt-4 h-full"
      :depth="[1000, 1100, 1200, 1300]"
      :displayList="displayList"
      chartBackground="rgb(0 12 55)"
      chartId="cccc"
    />
  </div>
</template>

<script>
import ChartHeader from "../../../components/ChartList/ChartHeader/ChartHeader.vue";
import OverlayChart from "../../../components/ChartList/OverlayChart/OverlayChart.vue";
export default {
  name: "OverlayVisualizationChart",

  components: {
    ChartHeader,
    OverlayChart
  },
  data() {
    return {
      displayList: [
        {
          name: "钻压",
          color: "#ffee00",
          unit: "kN",
          chartData: [10, 30, 40, 20]
        },
        {
          name: "钻压",
          color: "#876800",
          unit: "kN",
          chartData: [10, 20, 20, 10]
        },
        {
          name: "钻压",
          color: "#9b0083",
          unit: "kN",
          chartData: [20, 20, 10, 30]
        },
        {
          name: "钻压",
          color: "#2c7505",
          unit: "kN",
          chartData: [60, 30, 30, 40]
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
