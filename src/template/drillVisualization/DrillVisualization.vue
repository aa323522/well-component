<template>
  <div class="drillVisualization w-full h-full relative">
    <div class="px-4 h-full">
      <div class="flex z-10 pt-20 pb-4 h-full">
        <!-- <nav-menu-base /> -->
        <div class="mx-6 bg-div p-4 width18">
          <well-info />
        </div>
        <div class="flex flex-1 h-full bg-div p-1 max-width70">
          <div class="ml-1">
            <div class="flex h-full">
              <div class="flex-1">
                <DepthSelection
                  :well-depth-data="wellDepthData"
                  @sliderConfirm="sliderChange"
                  :depth-limit="depthLimit"
                />
              </div>
              <!--TODO: 根据接口返回，目前先写死style颜色 -->
              <div class="flex flex-column flex-1 ml-4 px-2 width7 level">
                <div class="text-center">
                  <span>层位</span>
                </div>
                <land-layer-chart
                  chart-id="drillChart"
                  :land-layer-data="landLayerData"
                  :depth-limit="depthLimit"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-column w-full h-full">
            <div class="flex justify-end py-1 gap-x-2">
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
            <div class="flex">
              <div class="flex-1" style="border-left: 1px solid #0aa2fa;">
                <chart-desc
                  desc-name="descName"
                  :display-list="displayList[0]"
                  :style="`font-size: 1rem`"
                />
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-full flex align-end"
                  style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
                >
                  <chart-desc
                    class="h-full"
                    desc-name="descName"
                    :display-list="displayList[1]"
                    :style="`font-size: 2.5rem`"
                  />
                </div>
              </div>
              <div class="flex-1 relative">
                <div
                  class="w-full h-full flex align-end"
                  style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
                >
                  <div class="z-10 absolute drillingRateHeader">
                    <a-tooltip placement="bottomRight" class="pointer">
                      <template slot="title">
                        <a-checkbox-group
                          class="rateCheckbox"
                          :options="drillingRateOptions"
                          :value="drillingRateType"
                          @change="handleDrillingRateChange"
                        />
                      </template>
                      <a-icon type="menu" />
                    </a-tooltip>
                  </div>
                  <div
                    v-if="Boolean(displayList[2])"
                    class="flex flex-column w-full h-full"
                    :style="`font-size: 1.5rem`"
                  >
                    <desc-div
                      class="flex-1"
                      :name="displayList[2][0].name"
                      :maxValue="Number(displayList[2][0].max)"
                      :minValue="Number(displayList[2][0].min)"
                      :unit="displayList[2][0].unit"
                      name-color="#FF007A"
                      stroke-color="#FF007A"
                    />
                    <desc-div
                      v-if="drillingRateType.length === 2"
                      class="flex-1"
                      :name="displayList[2][1].name"
                      :maxValue="Number(displayList[2][1].max)"
                      :minValue="Number(displayList[2][1].min)"
                      :unit="displayList[2][1].unit"
                      progress-class="progressDashed"
                      name-color="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex w-full flex-1"
              style="color:#0aa2fa;border: 1px solid #0aa2fa;"
            >
              <chart
                chart-id="chartId1"
                style="border-right: 1px solid #0aa2fa;"
                chart-background="#000c37d9"
                :display-list="displayList[0]"
                :depth="depth"
                :depth-limit="depthLimit"
              />
              <chart
                chart-id="chartId2"
                style="border-right: 1px solid #0aa2fa;"
                chart-background="#000c37d9"
                :display-list="displayList[1]"
                :depth="depth"
                :depth-limit="depthLimit"
              />
              <chart
                chart-id="chartId3"
                chart-background="#000c37d9"
                :display-list="drillingRateChartData"
                :depth="depth"
                :depth-limit="depthLimit"
              />
            </div>
          </div>
        </div>
        <div class="ml-4 drill-bit bgc">
          <DrillBitInfo
            :bit-info="bitInfo"
            :well-list="wellList"
            :well-name="wellName"
            @changeWellName="changeWellName"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepthSelection from "../../components/depthSelection/DepthSelection";
import BitInfoChart from "../../components/BitInfoChart/BitInfoChart";
import ChartDesc from "../../components/chartDesc/ChartDesc";
import DescDiv from "../../components/descDiv/DescDiv";
import LandLayerChart from "../../components/landLayerChart/LandLayerChart";
import WellInfo from "../../components/wellInfo/WellInfo";
import DrillBitInfo from "../../components/drillBitInfo/DrillBitInfo.vue";
import HeaderBase from "../../components/headerBase/HeaderBase";
import navMenuBase from "../../components/navMenuBase/NavMenuBase";
import Chart from "../../components/chart/Chart";
import { isEmpty } from "lodash";
export default {
  name: "DrillVisualization",
  components: {
    LandLayerChart,
    DepthSelection,
    ChartDesc,
    BitInfoChart,
    WellInfo,
    DrillBitInfo,
    HeaderBase,
    navMenuBase,
    Chart,
    DescDiv
  },
  props: {
    // description: 深度组件的具体深度，由一个对象组成，键名为深度， 键值为该深度下，具体包含的值
    // example:
    // {
    //   3500: { WELL_DEPTH: 3500, ROTATE_SPEED: 10, DATE: '10:30' }
    //   3600: { WELL_DEPTH: 3600, ROTATE_SPEED: 12, DATE: '11:30' }
    //   3700: { WELL_DEPTH: 3700, ROTATE_SPEED: 14, DATE: '12:30' }
    // }
    wellDepthData: {
      type: Object
    },
    // description: 表头的值
    // example: [{
    //   max: 89.23,
    //   min: 17.73,
    //   name: "钻压",
    //   color: "#4ce791",
    //   unit: "kN",
    //   chartData: [
    //     60.87,
    //     23.76,
    //     20.64,
    //   ]
    //  }
    // ]
    displayList: {
      type: Array,
      default: () => [[], [], []]
    },
    // description: 转头详细的数据
    // example: {
    //   wellDepth: 3408,
    //   bitType: 1,
    //   bitDiameter: 444,
    //   drillingFootage: 158,
    //   bitWear: 0,
    //   footageTime: 0,
    //   rop: 7,
    //   preRop: 8
    // }
    bitInfo: {
      type: Object,
      default: () => {}
    },
    wellList: {
      type: Array,
      default: () => []
    },
    wellName: {
      type: String,
      default: ""
    },
    //切换井名
    changeWellName: {
      type: Function,
      default: () => {}
    },
    // 暂停按钮切换事件
    onStatusSwitch: {
      type: Function,
      default: () => {}
    },
    isRunning: {
      type: Boolean,
      default: true
    },
    // speedRadio: {
    //   type: Number,
    //   default: 1
    // },
    setSpeedRadio: {
      type: Function,
      default: () => {}
    },
    init: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      depthLimit: [],
      depth: [],
      landLayerData: [],
      drillingRateOptions: [
        { label: "真实钻速", value: "reality", disabled: true },
        { label: "预测钻速", value: "prediction", disabled: false }
      ],
      drillingRateType: ["reality", "prediction"],
      drillingRateChartData: [],
      speedValue: 1
    };
  },
  watch: {
    displayList: {
      handler(value) {
        if (isEmpty(value)) return;
        this.drillingRateChange(this.drillingRateType);
      },
      deep: true
    },
    wellDepthData: {
      handler() {
        // 对page层返回的数据进行处理
        const depth = [];
        const landLayerData = [];
        this.depth = Object.keys(this.wellDepthData).forEach(item => {
          depth.push(parseFloat(item));
          landLayerData.unshift({
            horizonName: this.wellDepthData[item].horizonName,
            depth: item
          });
        });

        // this.depthLimit  =

        this.depthLimit = [depth[0], depth[depth.length - 1]];

        this.depth = depth;
        this.landLayerData = landLayerData;
      },
      deep: true
    }
  },
  mounted() {
    // Object.keys(wellDepthData).map(item => parseFloat(item))
  },
  methods: {
    handleStatusSwitch() {
      this.onStatusSwitch();
    },
    handleDrillingRateChange(type) {
      this.drillingRateType = type;
      this.drillingRateChange(type);
    },
    drillingRateChange(type) {
      if (type.includes("prediction")) {
        this.drillingRateChartData = this.displayList[2];
      } else {
        this.drillingRateChartData = [this.displayList[2][0]];
      }
    },
    goHome(index) {
      if (index == 0) {
        this.$router.push("/");
      }
    },
    sliderChange(e) {
      this.depthLimit = e;
    },
    changeSpeed(multiplier) {
      this.speedValue = multiplier;
      this.init(multiplier, true);
      this.setSpeedRadio(multiplier);
    }
  }
};
</script>

<style lang="less">
@import "../../style/DrillVisualization.less";
</style>
