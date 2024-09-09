<template>
  <div class="recommendedParameters w-full !h-full relative">
    <div class="!flex gap-x-2 !h-full">
      <div
        style="
          height: 100%;
          min-width: 300px;
          width: 40%;
          background: #08264a;
          border: 2px solid #7bbfe7;
        "
      >
        <div style="height: 60%;">
          <div class="flex flex-column h-full">
            <div class="flex" style="height: 40px;">
              <div
                class="flex flex-1 border-right"
                style="border-color: rgb(40 77 121)"
              >
                <span class="text-lg">推荐参数：</span>
                <div class="flex w-full justify-between flex-1">
                  <el-select
                    v-model="parameterValue"
                    popper-class="parameter-select-dropdown"
                    :popper-append-to-body="false"
                    placeholder="请选择"
                    @change="onChange"
                  >
                    <el-option
                      v-for="item in parameterList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="flex-1 flex align-center flex relative">
                <div class="text-lg">优化目标：</div>
                <div class="flex-1">
                  <div
                    v-if="isZi"
                    class="flex justify-between w-full align-center"
                  >
                    <el-button>自主寻优</el-button>
                  </div>
                  <el-select
                    v-if="isJie"
                    v-model="ladderValue"
                    placeholder="请选择"
                    @change="onChangeLadder"
                    popper-class="parameter-select-dropdown"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="item in ladderList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="handleClickOptimizing" class="absolute right-0 top-0"
                      >立即优化</el-button
                    >
                </div>
                <!-- <div class="mr-8">
                  <div><span class="text-10">实际排量:50L/s</span></div>
                  <div><span class="text-10">建议排量:60L/s</span></div>
                </div> -->
              </div>
            </div>
            <div class="flex flex-column" style="height: calc(100% - 40px);">
              <div
                class="flex"
                style="border-bottom: 1px dashed rgb(40 77 121); height: 50%"
              >
                <div
                  class="flex-1 flex border-right"
                  style="border-color: rgb(40 77 121)"
                >
                  <!-- 钻压 -->
                  <GaugeChart
                    chart-id="id1"
                    unit="tone"
                    :data="mseSurface"
                    :realityData="realityWobData"
                    :recommendedData="recommendedWobData"
                  />
                </div>
                <div class="flex-1">
                  <!-- 机械比能 -->
                  <QuantityBarChart
                    chart-id="id2"
                    :realityData="realityMseData"
                    :recommendedData="recommendedMseData"
                    type="mse"
                    unit="MPa"
                  />
                </div>
              </div>
              <div
                class="flex border-bottom"
                style="border-color: rgb(40 77 121); height: 50%;"
              >
                <div
                  class="flex-1 border-right"
                  style="border-color: rgb(40 77 121)"
                >
                  <!-- 机械转速 -->
                  <GaugeChart
                    chart-id="id3"
                    unit="rpm"
                    :data="mseSurface"
                    :realityData="realityRotateRpmData"
                    :recommendedData="recommendedRotateRpmData"
                  />
                </div>
                <div class="flex-1">
                  <!-- 机械钻速 -->
                  <QuantityBarChart
                    chart-id="id4"
                    :realityData="realityRopData"
                    :recommendedData="recommendedRopData"
                    type="rotateRpm"
                    unit="m/h"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full" style="height: 40%;">
          <div class="h-full w-full">
            <HeatMap
              chart-id="id9"
              :levelList="levelList"
              type="recommend"
              :wellName="wellName"
              :horizonName="horizonName"
              :currentDepth="depth.length ? depth[depth.length - 1] : 0"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-column"
        style="
          width: 250px;
          background: #08264a;
          border: 2px solid rgb(123, 191, 231);
        "
      >
        <div>
          <div class="flex justify-center">
            <span style="fontSize: 20px">钻参优化置信度</span>
          </div>
          <div class="flex justify-center" style="fontSize: 30px; color: red">
            <span>{{ confidenceRatio }}%</span>
          </div>
        </div>
        <div v-if="currentFlowIn !== undefined">
          <div class="flex justify-center">
            <span style="fontSize: 20px">排量</span>
          </div>
          <div
            class="flex justify-center"
            style="fontSize: 30px; color: #54bbe9"
          >
            <span>{{ Math.floor(currentFlowIn) }}L/min</span>
          </div>
        </div>
        <div class="flex-1 px-4 py-2">
          <div class="flex h-full" style="background: #103665">
            <div style="width: 100px">
              <depthSelection
                @sliderConfirm="sliderChange"
                :well-depth-data="wellDepthData"
                :displayTime="false"
                :depth-limit="depthLimit"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-1 flex"
        style="
          background: #08264a;
          border: 2px solid rgb(123, 191, 231);
          border-top: 0 !important;
        "
      >
        <ChartGroup
          isCanSettingMinMax
          :settingMinMax="{ minValue: 0, maxValue: 30 }"
          style="border-right: 2px solid rgb(123, 191, 231)"
          class="flex-1"
          chart-id="recommendedChart-1"
          chart-background="#000c37d9"
          title-size="basic"
          :depthLimit="depthLimit"
          :display-item="chartData[0]"
          :depth="depth"
          :setDisplayItem="
            (data) => {
              setDisplayItem(data, 0);
            }
          "
        />
        <ChartGroup
          isCanSettingMinMax
          :settingMinMax="{ minValue: 0, maxValue: 150 }"
          style="border-right: 2px solid rgb(123, 191, 231)"
          class="flex-1"
          chart-id="recommendedChart-2"
          chart-background="#000c37d9"
          title-size="basic"
          :depthLimit="depthLimit"
          :display-item="chartData[1]"
          :depth="depth"
          :setDisplayItem="
            (data) => {
              setDisplayItem(data, 1);
            }
          "
        />
        <ChartGroup
          isCanSettingMinMax
          style="border-right: 2px solid rgb(123, 191, 231)"
          class="flex-1"
          chart-id="recommendedChart-3"
          chart-background="#000c37d9"
          title-size="basic"
          :depthLimit="depthLimit"
          :display-item="chartData[2]"
          :depth="depth"
          :setDisplayItem="
            (data) => {
              setDisplayItem(data, 2);
            }
          "
        />
        <ChartGroup
          style="border-right: 2px solid rgb(123, 191, 231)"
          class="flex-1"
          chart-id="recommendedChart-4"
          chart-background="#000c37d9"
          title-size="basic"
          :depthLimit="depthLimit"
          :display-item="chartData[3]"
          :depth="depth"
          :setDisplayItem="
            (data) => {
              setDisplayItem(data, 3);
            }
          "
        />

        <a-dropdown class="speed">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <span class="speed-name">X{{ speedValue }}</span
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
                  changeSpeed(16);
                }
              "
            >
              <span>X16</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- <div class="flex flex-column chartGroup w-full h-full flex-1">
          <chart-desc :display-list="chartData[3]" style="fontSize: 1.25rem" />
          <div class="flex-1">
            <wearStripChart
              :chartData="chartData[3].length ? chartData[3][0].chartData : []"
              :depthLimit="depthLimit"
              :depth="depth"
            />
          </div>

        </div> -->
      </div>
      <div
        style="
          min-Width: 150px;
          width: 16%;
          background: #08264a;
          border: 2px solid rgb(123, 191, 231);
        "
      >
        <DrillingState
          :horizonName="horizonName"
          :wearMonitoring="wearMonitoring"
          :currentDepth="depth.length ? depth[depth.length - 1] : 0"
          :conditions="conditions"
          :currentData="currentData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep, max, min } from "lodash";
import HeatMap from "../../template/WellVisualizationCharts/HeatMap/HeatMap.vue";
import GaugeChart from "../GaugeChart/GaugeChart";
import QuantityBarChart from "../QuantityBarChart/QuantityBarChart.vue";
import LandLayerChart from "../landLayerChart/LandLayerChart.vue";
import DepthSelection from "../depthSelection/DepthSelection.vue";
import ChartDesc from "../chartDesc/ChartDesc.vue";
import ChartGroup from "../../template/chartGroup/ChartGroup.vue";
import DrillingState from "../../template/drillingState/DrillingState.vue";
import {
  getLatestData,
  getRopRecord,
} from "../../api/detectionAndImprovementApi.js";
import WearStripChart from "../chartComponents/wearStripChart/WearStripChart.vue";
import { Message } from "element-ui";
export default {
  name: "RecommendedParameters",
  components: {
    HeatMap,
    GaugeChart,
    QuantityBarChart,
    LandLayerChart,
    DepthSelection,
    ChartDesc,
    ChartGroup,
    DrillingState,
    WearStripChart,
  },
  props: {
    levelList: {
      type: Array,
      default: () => [],
    },
    wellName: {
      type: String,
    },
    horizonName: {
      type: String,
    },
    setCsvData: {
      type: Function,
      default: () => {},
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  watch: {
    wellName: {
      handler() {
        this.resetAndChangeName();
      },
      deep: true,
    },
    horizonName: {
      handler() {
        this.resetAndChangeName();
      },
      deep: true,
    },
  },
  data() {
    return {
      // 钻头深度和当前井深字段显示要对换，不在钻进状态只显示当前井深
      isDrilling: true,
      // rop是钻速 rotate是转速
      currentData: {},
      chartData: [[], [], [], []],
      depth: [],
      time: [],
      confidenceRatio: 93,
      wellDepthData: {},
      mseSurface: [],
      landLayerData: [],
      actualDisplacement: "",
      realityWobData: 0,
      recommendedWobData: 0,
      realityRopData: 0,
      recommendedRopData: 0,
      realityMseData: 0,
      recommendedMseData: 0,
      realityRotateRpmData: 0,
      recommendedRotateRpmData: 0,
      currentWellDepth: 3377.99,
      wearMonitoring: 0,
      horizonNameList: [],
      depthList: [],
      realityWobDataList: [],
      recommendedWobDataList: [],
      realityRopDataList: [],
      recommendedRopDataList: [],
      ropList: [],
      calcRopDataList: [],
      timer: undefined,
      depthLimit: [],
      conditions: undefined,
      parameterValue: "",
      parameterList: [
        {
          value: 1,
          label: "自主提速",
        },
        {
          value: 2,
          label: "区块提速",
        },
      ],
      ladderValue: "",
      ladderList: [
        {
          value: "5",
          label: "5min",
        },
        {
          value: "10",
          label: "10min",
        },
        {
          value: "20",
          label: "20min",
        },
      ],
      isZi: true,
      isJie: false,
      speedValue: 1,
      optimizingValue: false,
      currentFlowIn: 0,
      csvData: [],
    };
  },
  created() {
    this.parameterValue = 1;
  },
  mounted() {
    this.init();
  },
  destroyed() {
    clearTimeout(this.timer);
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      // // 初期化
      await this.handleGetInitData();
      this.timer = setInterval(async () => {
        await this.handleGetLatestData();
      }, 5000);
    },
    // 切换自主寻优30米开关
    async handleClickOptimizing() {
      this.optimizingValue = true;
      await this.handleGetLatestData();
      clearInterval(this.timer)
      clearTimeout(this.timer)
      
      this.timer = setInterval(async () => {
        await this.handleGetLatestData();
      }, 5000);
    },
    // 选择其他井名或层级的时候，需要清空掉当前画面的
    async resetAndChangeName() {
      this.wellDepthData = {};
      this.depth = [];
      this.time = []
      this.landLayerData = [];
      this.chartData = [[], [], [], []];
      this.depthLimit = [];
      clearInterval(this.timer);

      this.init();
    },
    deconstructionData(item) {
      return {
        depth: item.wellDepth,
        landLayerData: {
          horizonName: item.horizonName,
          depth: item.wellDepth,
        },

        wobOptData: item.wobOpt,
        wobData: item.wob,

        rotateOptData: item.rotateOpt,
        rotateSpeedData: item.rotateSpeed,

        calcRopData: item.ropOpt,
        ropData: item.rop,

        // wearMonitoringData: item.wearMonitoring,

        aggressiveData: item.aggressive,
        wearMonitoringData: item.wear,
        wearMseData: item.wearMse,
        time: item.time,

        wellDepthData: {
          [item.wellDepth]: {
            DATE: `${this.dayjs(item.time).format("HH:mm")} ${item.wellDepth}m`,
          },
        },
      };
    },
    async handleGetInitData() {
      const { success, data: resData } = await getRopRecord({
        wellName: this.wellName
      });

      this.setCsvData(resData);
      this.csvData = resData;
      if (success != true) {
        Message("获取历史记录值出错");
        return 
      }

      const depth = [];
      let time = []
      const landLayerData = [];
      let chartData = [];
      const wobOptData = [];
      const wobData = [];
      const rotateOptData = [];
      const rotateData = [];
      const calcRopData = [];
      const ropData = [];
      const wellDepthData = {};

      const aggressiveData = [];
      const wearMonitoringData = [];
      const wearMseData = [];

      resData.forEach((item, index) => {
        const data = this.deconstructionData(item);
        depth.push(data.depth);
        time.push(data.time)
        landLayerData.push(data.landLayerData);

        wobOptData.push(data.wobOptData);
        wobData.push(data.wobData);
        rotateOptData.push(data.rotateOptData);
        rotateData.push(data.rotateSpeedData);
        calcRopData.push(data.calcRopData);
        ropData.push(data.ropData);

        aggressiveData.push(data.aggressiveData　|| 0);
        wearMonitoringData.push(data.wearMonitoringData || 0);
        wearMseData.push(data.wearMseData || 0);

        Object.assign(wellDepthData, data.wellDepthData);

        if (index === resData.length - 1) {
          this.realityWobData = item.wob ?  Number(item.wob.toFixed(2)) : 0;
          this.recommendedWobData =item.wobOpt ?  Number(item.wobOpt.toFixed(2)) : 0;
          this.realityRopData = item.rop ? Number(item.rop.toFixed(2)) : 0;
          this.recommendedRopData = item.ropOpt ? Number(item.ropOpt.toFixed(2)) : 0;
          this.realityMseData = item.mse ? Number(item.mse.toFixed(2)) : 0;
          this.recommendedMseData = item.mseOpt ? Number(item.mseOpt.toFixed(2)) : 0;
          this.realityRotateRpmData = item.rotateSpeed ? Number(item.rotateSpeed.toFixed(2)) : 0;
          this.recommendedRotateRpmData = item.rotateOpt ? Number(item.rotateOpt.toFixed(2)) : 0;
          this.wearMonitoring = item.wearMonitoring ? Number(item.wearMonitoring) : 0;
          this.conditions = item.conditions;

          this.currentFlowIn = item.flowOut;
          this.currentData = {
            bitDepth: item.bitDepth,
            bitFootage: item.bitFootage,
            drillingFootage: item.drillingFootage,
            drillingTime: item.drillingTime,
            bitDiameter: item.bitDiameter
          };
        }
      });

      const wobMax = 30;
      const wobMin = 0;

      const rotateMax = 150;
      const rotateMin = 0;

      const ropMax = 50;
      const ropMin = 0;

      const realityColor = "#4ff4fe";
      const recommendedColor = "#4273ea";

      const aggressiveMax = max(aggressiveData)
      const aggressiveMin = min(aggressiveData)

      const wearMseMax = max(wearMseData);
      const wearMseMin = min(wearMseData);

      const wearMonitoringMax = max(wearMonitoringData);
      const wearMonitoringMin = min(wearMonitoringData);

      chartData = [
        [
          {
            name: "实际钻压",
            unit: "tone",
            chartData: wobData,
            minValue: wobMin,
            maxValue: wobMax,
            color: realityColor,
          },
          {
            name: "优化钻压",
            unit: "tone",
            chartData: wobOptData,
            minValue: wobMin,
            maxValue: wobMax,
            color: recommendedColor,
          },
        ],
        [
          {
            name: "实际转速",
            unit: "rpm",
            chartData: rotateData,
            minValue: rotateMin,
            maxValue: rotateMax,

            color: realityColor,
          },
          {
            name: "优化转速",
            unit: "rpm",
            chartData: rotateOptData,
            minValue: rotateMin,
            maxValue: rotateMax,
            color: recommendedColor,
          },
        ],
        [
          {
            name: "实际钻速",
            unit: "m/h",
            chartData: ropData,
            minValue: ropMin,
            maxValue: ropMax,

            color: realityColor,
          },
          {
            name: "优化钻速",
            unit: "m/h",
            chartData: calcRopData,
            minValue: ropMin,
            maxValue: ropMax,
            color: recommendedColor,
          },
        ],
        [
          {
            name: "钻头攻击性",
            unit: "",
            chartData: aggressiveData,
            maxValue: aggressiveMax,
            minValue: aggressiveMin,
            color: realityColor,
          },
          {
            name: "钻头磨损指标",
            unit: "",
            chartData: wearMonitoringData,
            max: wearMonitoringMax,
            min: wearMonitoringMin,
            minValue: wearMonitoringMin,
            maxValue: wearMonitoringMax,
            color: "#c9c9c9",
            lineType: "dashed",
          },
          {
            name: "机械比能",
            unit: "",
            chartData: wearMseData,
            max: wearMseMax,
            min: wearMseMin,
            minValue: wearMseMin,
            maxValue: wearMseMax,
            color: recommendedColor,
          },
        ],
      ];

      this.wellDepthData = wellDepthData;

      this.depth = depth.sort((pre,next) => {
          const a = Number(pre.wellDepth || 0)
          const b = Number(next.wellDepth || 0)
          return a - b
        });

      // 当总数据为空时，没有time值，这时候传一个当前时间准备给获取最新值的用
      if (!resData.length ) {
        time = [this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),]
      }
      this.time  = time
      this.landLayerData = landLayerData;
      this.chartData = chartData;
      this.setLoading(false);
    },
    // 获取钻速最新数据
    async getLatestData() {
      const time = this.time.length ? this.time[this.time.length - 1] : new Date()

      const data = await getLatestData({
        optTarget: this.parameterValue == 1 ? "自主寻优" : this.ladderValue,
        type: this.parameterValue,
        wellName: this.wellName,
        wellDepth: this.depth.length ? this.depth[this.depth.length - 1] : 0,
        time: this.dayjs(time).format("YYYY-MM-DD HH:mm:ss.SSS"),
        optNow: this.optimizingValue,
      });
      return data;
    },
    async handleGetLatestData() {
      const { success, data, msg } = await this.getLatestData();

      this.optimizingValue = false;
      if (success != true || isEmpty(data)) {
        Message(msg || "取得的值出现错误或者暂无数据");
        console.warn('返回的值为空或success为false')
        return;
      }

      if (typeof data !== 'object' || data === null || data === undefined) {
        this.conditions = '非钻进';
        Message({message:data, duration: 1000});
        console.warn('非钻进状态/返回的值不是对象类型')
        return
      }

      if (data.conditions !== '钻进') {
        this.conditions = '非钻进';
      } else {
        this.conditions = '钻进';
      }

      this.csvData.push(data);
      this.setCsvData(this.csvData);

      const newData = this.deconstructionData(data);
      this.depth = [...this.depth, newData.depth].sort((pre,next) => {
        const a = Number(pre.wellDepth || 0)
        const b = Number(next.wellDepth || 0)
        return a - b
      });

      this.time = [...this.time, newData.time];
      this.landLayerData.push(newData.landLayerData);

      const depthDataClone = cloneDeep(this.wellDepthData);

      Object.assign(depthDataClone, newData.wellDepthData);
      this.wellDepthData = depthDataClone;

      this.realityWobData =  data.wob?  Number(data.wob.toFixed(2)) : 0;
      this.recommendedWobData = data.wobOpt ? Number(data.wobOpt.toFixed(2)) : 0;
      this.realityRopData = data.rop ? Number(data.rop.toFixed(2)) : 0;
      this.recommendedRopData = data.ropOpt? Number(data.ropOpt.toFixed(2)) : 0;
      this.realityMseData = data.mse ? Number(data.mse.toFixed(2)) : 0;
      this.recommendedMseData = data.mseOpt ? Number(data.mseOpt.toFixed(2)) : 0;
      this.realityRotateRpmData = data.rotateSpeed ? Number(data.rotateSpeed.toFixed(2)) : 0;
      this.recommendedRotateRpmData = data.rotateOpt ? Number(data.rotateOpt.toFixed(2)) : 0;
      this.wearMonitoring = data.wearMonitoring ? Number(data.wearMonitoring) : 0;

      this.isDrilling = data.conditions === '钻进'

      this.currentData = {
        bitDepth: this.isDrilling ? data.bitDepth : '----',
        bitFootage: data.bitFootage,
        drillingFootage: data.drillingFootage,
        drillingTime: data.drillingTime,
        bitDiameter: data.bitDiameter
      };
      this.currentFlowIn = data.flowOut;

      const chartDataClone = cloneDeep(this.chartData);
      if (!chartDataClone[0][0]) return

      chartDataClone[0][0].chartData.push(this.realityWobData);
      chartDataClone[0][1].chartData.push(this.recommendedWobData);
      chartDataClone[1][0].chartData.push(this.realityRotateRpmData);
      chartDataClone[1][1].chartData.push(this.recommendedRotateRpmData);
      chartDataClone[2][0].chartData.push(this.realityRopData);
      chartDataClone[2][1].chartData.push(this.recommendedRopData);

      // const wobMax = max([
      //   ...chartDataClone[0][0].chartData,
      //   ...chartDataClone[0][1].chartData
      // ]);
      // const wobMin = min([
      //   ...chartDataClone[0][0].chartData,
      //   ...chartDataClone[0][1].chartData
      // ]);

      // const rotateMax = max([
      //   ...chartDataClone[1][0].chartData,
      //   ...chartDataClone[1][1].chartData
      // ]);
      // const rotateMin = min([
      //   ...chartDataClone[1][0].chartData,
      //   ...chartDataClone[1][1].chartData
      // ]);

      // const ropMax = max([
      //   ...chartDataClone[2][0].chartData,
      //   ...chartDataClone[2][1].chartData
      // ]);
      // const ropMin = min([
      //   ...chartDataClone[2][0].chartData,
      //   ...chartDataClone[2][1].chartData
      // ]);

      // chartDataClone[0][0].maxValue = 150;
      // chartDataClone[0][1].minValue = 0;
      // chartDataClone[1][0].maxValue = 150;
      // chartDataClone[1][1].minValue = 0;
      // chartDataClone[2][0].maxValue = 150;
      // chartDataClone[2][1].minValue = 0;

      // const aggressiveMax = max([
      //   ...chartDataClone[2][0].chartData,
      //   ...chartDataClone[2][1].chartData
      // ]);
      // const aggressiveMin = min(aggressiveData);

      // const wearMseMax = max(wearMseData);
      // const wearMseMin = min(wearMseData);

      chartDataClone[3][0].chartData.push(newData.aggressiveData);
      chartDataClone[3][1].chartData.push(newData.wearMonitoringData);
      chartDataClone[3][2].chartData.push(newData.wearMseData);

      this.chartData = chartDataClone;
    },
    onChange(val) {
      this.parameterValue == val;
      this.depth.length = 0;
      if (val == 1) {
        this.isJie = false;
        this.isZi = true;
      } else if (val == 2) {
        this.isZi = false;
        this.isJie = true;
        this.ladderValue = "5";
      }
      this.resetAndChangeName();
    },
    onChangeLadder(val) {
      this.depth.length = 0;
      this.ladderValue = val;
      this.resetAndChangeName();
    },
    changeSpeed(multiplier) {
      clearInterval(this.timer);
      this.speedValue = multiplier;
      this.setSpeedRadio(multiplier);
    },
    setSpeedRadio(speedRadio) {
      this.speedRadio = speedRadio;
      this.timer = setInterval(() => {
        this.handleGetLatestData();
      }, 5000 / speedRadio);
    },
    sliderChange(e) {
      this.depthLimit = e;
    },
    setDisplayItem(data, index) {
      const chartDataClone = cloneDeep(this.chartData);
      chartDataClone[index] = data;

      this.chartData = chartDataClone;
    },
  },

};
</script>

<style lang="less">
@import "../../style/RecommendedParameters.less";

.chartDescHeight {
  height: 12rem !important;
}

.recommendedParameters {
  height: 100% !important;
  .optimizingSelector {
    background: #0a5aa3;
  }
  .optimizingSelector.ant-switch-checked {
    background: greenyellow;
  }
}
</style>
../../api/DetectionAndImprovementApi.js
