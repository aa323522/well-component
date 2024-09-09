<template>
  <div class="descDiv w-full">
    <div class="flex align-center desc h-full">
      <div class="flex flex-column space-between h-full w-full text-center">
        <div class="flex justify-center align-center flex-1 mb-3">
          <span :style="`color: ${nameColor}`"
            >{{ name }} <span v-if="unit">({{ unit }})</span></span
          >
        </div>
        <div class="flex flex-column align-center relative mb-1">
          <a-progress
            :showInfo="false"
            :stroke-color="strokeColor"
            :class="`mx-2 ${progressClass}`"
            :percent="100"
          />
          <div
            class="flex space-between w-full text-10 absolute omit"
            style="top: -20px"
          >
            <span class="px-0 font-color">{{ parseInt(minValue) }}</span>
            <span class="px-0 font-color">{{ parseInt(maxValue) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DescDiv",
  props: {
    name: {
      type: String
    },
    nameColor: {
      type: String
    },
    strokeColor: {
      type: String
    },
    progressClass: {
      type: String,
      default: ""
    },
    maxValue: {
      type: Number,
      default: ""
    },
    minValue: {
      type: Number,
      default: ""
    },
    unit: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
@import "../../style/DescDiv.less";
</style>
