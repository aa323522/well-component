<template>
  <div class="wellChart w-full h-full relative bgc">
    <div class="flex h-full font-color p-2">
      <div class="mr-8">
        <div class="flex-1 h-full">
          <depth-selection
            :well-depth-data="wellDepthData"
            @sliderConfirm="sliderChange"
          />
        </div>
      </div>
      <div class="flex h-full gap-x-2 w-full">
        <div class="flex-1 h-full">
          <chart-group
            chart-id="chartId1"
            chart-background="#000c37d9"
            :title-size="titleSize"
            :depth-limit="depthLimit"
            :display-item="displayList[0]"
            :depth="depth"
          />
        </div>
        <div class="flex-1 h-full">
          <chart-group
            chart-id="chartId2"
            chart-background="#000c37d9"
            :title-size="titleSize"
            :depth-limit="depthLimit"
            :display-item="displayList[1]"
            :depth="depth"
          />
        </div>
        <div class="flex-1 h-full">
          <chart-group
            chart-id="chartId3"
            chart-background="#000c37d9"
            :title-size="titleSize"
            :depth-limit="depthLimit"
            :display-item="displayList[2]"
            :depth="depth"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepthSelection from "../../components/depthSelection/DepthSelection.vue";
import ChartGroup from "../chartGroup/ChartGroup.vue";

export default {
  name: "WellChart",
  props: {
    titleSize: {
      default: "basic",
      type: String
    },
    wellDepthData: {
      type: Object,
      required: {}
    },
    displayList: {
      type: Array,
      default: [[], [], []]
    },
    depth: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ChartGroup,
    DepthSelection
  },
  data() {
    return {
      bgUrl: require("../../assets/bg-1.png"),
      depthLimit: []
    };
  },
  methods: {
    sliderChange(e) {
      this.depthLimit = e;
    }
  }
};
</script>

<style lang="less">
@import "../../style/WellChart.less";
</style>
