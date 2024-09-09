<template>
  <div class="wellTypeMenu w-full font-color bgc">
    <div class="text-18 well-type">
      <el-tooltip
        v-tooltipautoshow
        effect="dark"
        :open-delay="500"
        :content="wellName"
        placement="top"
      >
        <span class="oneline">{{ wellName }}</span>
      </el-tooltip>
</div>
    <div>
      <div class="w-full flex align-center text-lg pointer">
        <a-icon
          type="left"
          :class="menuType == 'drilling' ? 'arrow arrowDisable' : 'arrow'"
          @click="handleChangeMenuType('drilling')"
        />
        <div class="flex justify-center align-center flex-1 typeBg h-10">
          <span
            :class="menuType == 'drilling' ? 'text-bold' : ''"
            @click="handleChangeMenuType('drilling')"
            >钻井</span
          >
        </div>
        <div class="flex justify-center align-center flex-1 typeBg h-10">
          <span
            :class="menuType == 'logging' ? 'text-bold' : ''"
            @click="handleChangeMenuType('logging')"
            >测井</span
          >
        </div>
        <a-icon
          type="right"
          :class="menuType == 'logging' ? 'arrow arrowDisable' : 'arrow'"
          @click="handleChangeMenuType('logging')"
        />
      </div>
      <div class="mt-2">
        <a-checkbox-group
          @change="handleCheckboxChange"
          v-model="initOptions"
          :defaultValue="defaultValue"
          class="checkboxItem px-1 py-6 flex flex-column gap-y-2 font-color"
        >
          <template>
            <a-checkbox
              v-for="item in plainOptions"
              :key="item.value"
              :class="
                !currentOptions.find(option => option.value === item.value)
                  ? '!none'
                  : undefined
              "
              :disabled="isDisabled(item.value)"
              :value="item.value"
            >
              <span class="well-type-well-label text-18">{{ item.label }}</span>
            </a-checkbox>
          </template>
        </a-checkbox-group>
      </div>
      <div
        class="flex justify-center detail pointer mt-4"
        v-if="isShow"
        @click="goDetail"
      >
        <span>详细</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WellTypeMenu",
  props: {
    wellName: {
      type: String,
      required: true
    },
    displayItem: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: Array,
      default: () => ["ROTATE_SPEED", "WOB", "PUMP_RATE"]
    },
    isShow: {
      type: Boolean,
      default: true
    },
    drillingOptions: {
      type: Array,
      default: () => []
    },
    loggingOptions: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    displayItem: {
      handler(newVal) {
        this.initOptions = newVal;
      },
      deep: true
    },
    drillingOptions: {
      handler(newVal) {
        this.plainOptions = [...this.drillingOptions, ...this.loggingOptions];
        this.currentOptions =
          this.menuType == "drilling"
            ? this.drillingOptions
            : this.loggingOptions;
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      initOptions: this.displayItem,
      plainOptions: [],
      currentOptions: [],
      menuType: "drilling"
    };
  },
  computed: {
    isDisabled() {
      return function(val) {
        if (
          (!this.initOptions.includes(val) && this.initOptions.length >= 9) ||
          (this.initOptions.includes(val) && this.initOptions.length <= 3)
        ) {
          return true;
        }
        return false;
      };
    }
  },
  methods: {
    handleCheckboxChange(e) {
      this.$emit("checkboxConfirm", e);
    },
    handleChangeMenuType(type) {
      this.menuType = type;
      this.currentOptions =
        type === "drilling" ? this.drillingOptions : this.loggingOptions;
    },
    goDetail() {
      this.$emit("goDetail");
    }
  }
};
</script>

<style lang="less">
@import "../../style/WellTypeMenu.less";
</style>
