<template>
  <div>
    <a-dropdown>
      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
        <span>X{{ speedValue }}</span
        ><a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item
          @click="
            () => {
              changeSpeed(1);
            }
          "
        >
          <span>X1</span>
        </a-menu-item>
        <a-menu-item
          @click="
            () => {
              changeSpeed(2);
            }
          "
        >
          <span>X2</span>
        </a-menu-item>
        <a-menu-item
          @click="
            () => {
              changeSpeed(4);
            }
          "
        >
          <span>X4</span>
        </a-menu-item>
        <a-menu-item
          @click="
            () => {
              changeSpeed(8);
            }
          "
        >
          <span>X8</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-icon
      class="pointer actionBtn"
      :type="isRunning ? 'pause-circle' : 'play-circle'"
      @click="handleStatusSwitch"
    />
  </div>
</template>

<script>
export default {
  name: "speedMenu",
  props: {
    isRunning: {
      type: Boolean,
      default: true
    },
    // 暂停按钮切换事件
    onStatusSwitch: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      depthLimit: [],
      depth: [],
      landLayerData: [],
      drillingRateType: ["reality", "prediction"],
      drillingRateChartData: [],
      speedValue: 1
    };
  },
  methods: {
    handleStatusSwitch() {
      this.onStatusSwitch();
    }
  }
};
</script>

<style></style>
