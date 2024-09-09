<template>
  <div
    class="w-full riskHeaderItem"
    style="background: #000c37d9; fontSize: 12px;"
  >
    <div class="flex align-center desc h-full">
      <div class="flex flex-column space-between h-full w-full text-center">
        <div class="flex w-full justify-center align-center flex-1 flex-column">
          <span class="text-bold" :style="`color: #ffffff; marginBottom: -10px`"
            >{{ name }} <span v-if="unit">({{ unit }})</span></span
          >
          <div class="flex flex-column align-center w-full px-2">
            <div class="w-full mx-2" style="height: 0px;marginBottom: -6px">
              <a-progress
                v-if="headerType === 'basic'"
                :showInfo="false"
                :stroke-color="nameColor"
                :class="`${progressClass}`"
                :percent="100"
              />
              <div v-if="headerType === 'overlay'" class="flex">
                <div
                  class="flex-1"
                  v-for="(color, index) in colorList"
                  :key="index"
                  :style="`background-color: ${color}; height: 12px`"
                ></div>
              </div>
            </div>
            <div class="flex space-between w-full">
              <span
                class="text-small px-0 font-color"
                :style="`color: ${nameColor}`"
                >{{ parseInt(minValue) }}</span
              >
              <span
                class="text-small px-0 font-color"
                :style="`color: ${nameColor}`"
                >{{ parseInt(maxValue) }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChartHeader",
  props: {
    headerType: {
      type: String,
      default: "basic"
    },
    colorList: {
      type: Array,
      default: () => []
    },
    name: {
      type: String
    },
    nameColor: {
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
.ant-progress-inner {
  background: inherit;
}

.riskHeaderItem {
  .ant-progress-bg {
    height: 4px !important;
  }
}
</style>
