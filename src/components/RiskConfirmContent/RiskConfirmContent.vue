<template>
  <div class="flex justify-end gap-x-2">
    <a-icon type="close" class="pointer" @click="() => handleRisk(2)" />
    <a-icon type="check" class="pointer" @click="() => handleRisk(1)" />
  </div>
</template>
<script>
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import { saveWarningLog } from "../..//api/riskInfoApi.js";
export default {
  name: "RiskConfirmContent",
  props: {
    closeFn: {
      type: Function,
      default: () => {}
    },
    getCurrentErrorFn: {
      type: Function,
      default: () => {}
    },
    currentData: {
      type: Object
    },
    confirmVisible: {
      type: Boolean,
      default: false
    },
    setConfirmVisible: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      locale,
      visible: false
    };
  },
  methods: {
    async handleRisk(status) {
      if (status == 1) {
        this.setConfirmVisible(true);
      } else {
        const endTime = this.dayjs("2000-01-01 00:00:00.000").format(
          "YYYY-MM-DD HH:mm:ss"
        );
        const params = {
          ...this.currentData,
          status: 2,
          time: undefined,
          endTime: endTime
        };
        await saveWarningLog(params);
        this.closeFn();
        this.getCurrentErrorFn();
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
