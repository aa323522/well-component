<template>
  <div class="depthSelection w-full h-full relative flex flex-column">
    <div v-if="displayTime" class="text-right font-color time">
      <div>{{ dateTime.slice(0, 5) }}<br />{{ dateTime.slice(5) }}</div>
    </div>
    <div class="flex-1 pt-2">
      <div class="sliderHeight">
        <a-slider
          range
          reverse
          @change="handleSliderChange"
          v-model="depth"
          :marks="marks"
          vertical
          :min="min"
          :max="max"
          :step="0.01"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, chunk } from "lodash";
export default {
  name: "DepthSelection",
  props: {
    // description: 深度组件的具体深度，由一个对象组成，键名为深度， 键值为该深度下，具体包含的值, DATE必须
    // example:
    // {
    //   3500: { WELL_DEPTH: 1000, ROTATE_SPEED: 10, DATE: '10:30' }
    //   3600: { WELL_DEPTH: 1100, ROTATE_SPEED: 12, DATE: '11:30' }
    //   3700: { WELL_DEPTH: 1200, ROTATE_SPEED: 14, DATE: '12:30' }
    // }
    wellDepthData: {
      type: Object
    },
    // description: 深度轴的区间
    // example: [3000, 4000]
    depthLimit: {
      type: Array,
      default: () => []
    },
    selectDepth: {
      type: Array,
      default: () => []
    },
    displayTime: {
      type: Boolean,
      default: true
    },
    displayMark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      depth: [],
      dateTime: "",
      timer: "",
      min: 0,
      max: 0,
      marks: {}
    };
  },
  watch: {
    wellDepthData: {
      handler() {
        this.$nextTick(() => {
          this.initSlider();
        });
      },
      deep: true,
      immediate: true
    },
    selectDepth: {
      handler(v) {
        this.depth = v;
        this.initSlider();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initSlider();
  },
  methods: {
    initSlider() {
      if (this.wellDepthData) {
        const keys = Object.keys(this.wellDepthData);
        this.min = parseFloat(keys[0]);
        this.max = parseFloat(keys[keys.length - 1]);
        this.depth = !isEmpty(this.depthLimit)
          ? this.depthLimit
          : [this.min, this.max];

        if (this.displayMark) {
          const maxChunk = 3;
          const marks = {};
          if (keys.length >= maxChunk) {
            const chunkDataList = chunk(keys, keys.length / maxChunk);
            chunkDataList.forEach((item, index) => {
              const depth =
                index == chunkDataList.length - 1
                  ? item[item.length - 1]
                  : item[0];
              Object.assign(marks, { [depth]: this.wellDepthData[depth].DATE });
            });

            this.marks = marks;
            return;
          }

          if (keys.length > 1) {
            Object.keys(this.wellDepthData).forEach(key => {
              Object.assign(marks, { [key]: this.wellDepthData[key].DATE });
            });

            this.marks = marks;
          }
        }
      }
    },
    handleSliderChange(e) {
      this.$emit("sliderConfirm", e);
    }
  },
  created() {
    this.dateTime = this.dayjs().format("YYYY年MM月DD日 HH:mm:ss");
  },
  mounted() {
    this.timer = setInterval(() => {
      this.dateTime = this.dayjs().format("YYYY年MM月DD日 HH:mm:ss");
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="less">
@import "../../style/DepthSelection.less";
</style>
