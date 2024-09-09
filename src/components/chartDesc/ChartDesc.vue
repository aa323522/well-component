<template>
  <div class="chartDescHeight w-full h-full">
    <div :class="'flex flex-column h-full ' + contentClass">
      <DescDiv
        v-for="(item, index) in displayList"
        :key="index"
        class="flex-1"
        :name="item.name"
        :maxValue="
          item.maxValue !== undefined ? Number(item.maxValue) : Number(item.max)
        "
        :minValue="
          item.minValue !== undefined ? Number(item.minValue) : Number(item.min)
        "
        :name-color="
          nameColor ? nameColor : item.color ? item.color : addClass(index)
        "
        :stroke-color="
          item.name === '声波时差'
            ? 'linear-gradient(90deg,  #04cc04 0%, #e51505 100%)'
            : strokeColor
            ? strokeColor
            : item.color
            ? item.color
            : addClass(index)
        "
        :unit="item.unit"
      />
    </div>
  </div>
</template>

<script>
import DescDiv from "../descDiv/DescDiv.vue";

import { isEmpty, max, min } from "lodash";

export default {
  name: "ChartDesc",
  props: {
    displayList: {
      type: Array,
      default: () => []
    },
    contentClass: {
      type: String,
      default: ""
    },
    nameColor: {
      type: String
    },
    strokeColor: {
      type: String
    }
  },
  data() {
    return {
      max: undefined,
      min: undefined
    };
  },
  watch: {
    displayList: {
      handler(displayList) {
        if (isEmpty(displayList)) return;

        displayList.forEach(item => {
          const maxData = max(item.chartData);
          const minData = min(item.chartData);

          if (item.max == undefined) {
            item.max = maxData;
          }

          if (item.min == undefined) {
            item.min = minData;
          }
        });
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    DescDiv
  },
  methods: {
    addClass(index) {
      if (index == 0) {
        return "#FF007A";
      } else if (index == 1) {
        return "#00C2FF";
      } else if (index == 2) {
        return "#ffd400";
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/ChartDesc.less";
</style>
