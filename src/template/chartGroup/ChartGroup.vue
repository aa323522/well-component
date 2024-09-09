<template>
  <div class="flex flex-column chartGroup w-full h-full relative">
    <div class="absolute right-0 z-10">
      <a-popconfirm
        v-if="isCanSettingMinMax"
        overlayClassName="chartGroupPopover"
        placement="bottom"
        ok-text="设置"
        cancel-text="取消"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template slot="title">
          <div>
            <div>
              <span class="text-bold text-lg" style="color: white">最大最小值设置</span>
            </div>
            <div>
              <a-input-number
                id="inputNumber"
                v-model="minInputValue"
                :max="maxInputValue"
              />
              <span>~</span>
              <a-input-number
                id="inputNumber"
                v-model="maxInputValue"
                :min="minInputValue"
              />
            </div>
            <div v-if="displayItem.length">
              <div>
                <span class="text-bold text-lg" style="color: white">曲线显示设置</span>
              </div>
              <div>
                <a-checkbox-group
                  :defaultValue="displayItem.map((item, index) => index)"
                  class="rateCheckbox"
                  :options="displayItem.map((item, index) => ({label: item.name, value: index}))"
                  @change="handleLineOptionsChange"
                />
              </div>  
            </div>
          </div>
        </template>
        <a-icon type="setting" class="pointer" style="color: white" @click="handleSettingBtnClick" />
      </a-popconfirm>
      <a-popconfirm
        v-else
        overlayClassName="chartGroupPopover"
        placement="bottom"
        ok-text="设置"
        cancel-text="取消"
        @cancel="handleCancel"
        @confirm="handleGroupConfirm"
      >
        <template slot="title">
          <div>
            <div>
              <div>
                <span class="text-bold text-lg" style="color: white"
                  >钻头攻击性设置</span
                >
              </div>
              <div>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[0].minInputValue"
                  :max="groupInput[0].maxInputValue"
                />
                <span>~</span>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[0].maxInputValue"
                  :min="groupInput[0].minInputValue"
                />
              </div>
            </div>
            <div>
              <div>
                <span class="text-bold text-lg" style="color: white">钻头磨损指标</span>
              </div>
              <div>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[1].minInputValue"
                  :max="groupInput[1].maxInputValue"
                />
                <span>~</span>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[1].maxInputValue"
                  :min="groupInput[1].minInputValue"
                />
              </div>
            </div>
            <div>
              <div>
                <span class="text-bold text-lg" style="color: white">机械比能</span>
              </div>
              <div>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[2].minInputValue"
                  :max="groupInput[2].maxInputValue"
                />
                <span>~</span>
                <a-input-number
                  id="inputNumber"
                  v-model="groupInput[2].maxInputValue"
                  :min="groupInput[2].minInputValue"
                />
              </div>
            </div>
          </div>
          <div v-if="displayItem.length">
            <div>
              <span class="text-bold text-lg" style="color: white">曲线显示设置</span>
            </div>
            <div>
              <a-checkbox-group
                :defaultValue="displayItem.map((item, index) => index)"
                class="rateCheckbox"
                :options="displayItem.map((item, index) => ({label: item.name, value: index}))"
                @change="handleLineOptionsChange"
              />
            </div>  
          </div>
          
        </template>
        <a-icon type="setting" class="pointer" @click="handleSettingBtnClick" />
      </a-popconfirm>
    </div>
    <chart-desc
      :descName="descName"
      :displayList="displayItem"
      :style="`font-size: ${
        fontSize(displayItem.length) / (titleSize === 'small' ? 2 : 1.4) > 1
          ? fontSize(displayItem.length) / (titleSize === 'small' ? 2 : 1.4)
          : 1
      }rem`"
    />
    <div class="flex-1">
     <chart
        v-show="displayIndexList.length !== 0"
        :chart-id="chartId"
        :chart-background="chartBackground"
        :depth="depth"
        :display-list="displayIndexList.length === 0 ?  [] : displayItem.filter((_item, index) => { return displayIndexList.includes(index)})"
        :depth-limit="depthLimit"
      />
    </div>
  </div>
</template>

<script>
import ChartDesc from "../../components/chartDesc/ChartDesc.vue";
import Chart from "../../components/chart/Chart.vue";
import { floor } from "lodash";
export default {
  name: "ChartGroup",
  components: {
    ChartDesc,
    Chart,
  },
  props: {
    // 能够设置最大最小值
    isCanSettingMinMax: {
      default: false,
      type: Boolean,
    },
    settingMinMax: {
      type: Object,
      default: () => {},
    },
    titleSize: {
      default: "basic",
      type: String,
    },
    nameColor: {
      type: String,
    },
    strokeColor: {
      type: String,
    },
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true,
    },
    chartBackground: {
      default: "",
      type: String,
    },
    imgUrl: {
      type: String,
    },
    descName: {
      type: String,
    },
    displayItem: {
      type: Array,
      default: () => [],
    },
    depthLimit: {
      type: Array,
      default: () => [],
    },
    depth: {
      type: Array,
      default: () => [],
    },
    setDisplayItem: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    fontSize() {
      return function (val) {
        const fontSize = 4 - val;
        if (fontSize) return fontSize;

        return 1;
      };
    },
  },
  watch: {
    displayItem: {
      handler(displayItem) {
        if (displayItem.length && this.isFirst && !this.isCanSettingMinMax) {  
          this.displayItem.forEach((item, index) => {
            this.groupInput[index] = {
              minInputValue: item.minValue ? floor(item.minValue) : 0,
              maxInputValue: floor(item.maxValue) ? floor(item.maxValue) : 1,
            }
          });
          this.isFirst = false
        }

        if (displayItem.length && this.firstFlag) {
          this.displayIndexList = displayItem.map((_item, index) => index) 
          this.firstFlag = false
        }
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return {
      firstFlag: true,
      displayIndexList: [],
      minInputValue: 0,
      maxInputValue: 0,
      groupInput: [
        {
          minInputValue: 0,
          maxInputValue: 0
        },
        {
          minInputValue: 0,
          maxInputValue: 0
        },
        {
          minInputValue: 0,
          maxInputValue: 0
        }
      ],
      isFirst: true,
    };
  },
  mounted() {
    if (this.isCanSettingMinMax) {
      this.resetMinMaxValue();
    }
  },
  methods: {
    handleLineOptionsChange (value) {
     this.displayIndexList = value
    },
    resetMinMaxValue() {
      if (this.settingMinMax) {
        this.minInputValue = this.settingMinMax.minValue;
        this.maxInputValue = this.settingMinMax.maxValue;
      }
    },
    handleSetNewMinMaxValue(minValue, maxValue) {
      const customMinMaxDisplayItem = this.displayItem.map((item) => {
        return { ...item, minValue, maxValue };
      });
      this.setDisplayItem(customMinMaxDisplayItem);
    },
    handleCancel() {
      this.resetMinMaxValue();
      this.handleSetNewMinMaxValue(
        this.settingMinMax.minValue,
        this.settingMinMax.maxValue
      );
    },
    handleConfirm() {
      this.handleSetNewMinMaxValue(this.minInputValue, this.maxInputValue);
    },
    handleGroupConfirm() {
      const customMinMaxDisplayItem = this.displayItem.map((item, index) => {
        return { 
          ...item, 
          minValue: this.groupInput[index].minInputValue, 
          maxValue: this.groupInput[index].maxInputValue };
      });
      this.setDisplayItem(customMinMaxDisplayItem);
      // const customMinMaxDisplayItem = this.displayItem.map((item) => {
      //   return { ...item, minValue, maxValue };
      // });
      // this.setDisplayItem(customMinMaxDisplayItem);
    },

    handleSettingBtnClick() {},
  },
};
</script>

<style lang="less">
@import "../../style/ChartGroup.less";

.chartGroupPopover {
  .anticon-exclamation-circle {
    display: none;
  }

  .ant-popover-message-title {
    padding-left: 0;
  }
}
</style>
