<template>
  <div class="frictionTorqueAnalysis flex flex-column pt-20 pb-4 h-full px-4">
    <a-spin :spinning="spinning" size="large" tip="计算中...">
      <div
        class="flex align-center gap-x-2 justify-between"
        style="height: 60px"
      >
        <div class="flex align-center gap-x-2 text-lg">
          <div>
            <span class="text-lg">井筒号：</span>
            <a-select style="width: 120px" v-model="wellNumber">
              <a-select-option value="1">
                马1-16HTN8
              </a-select-option>
            </a-select>
          </div>
          <div v-if="analysisType === 'trip'">
            <span class="text-lg">井段:</span>
            <a-input-number
              id="inputNumber"
              v-model="bitStartPosition"
              :max="bitEndPosition"
              @change="onChange"
            />
            <span class="mx-2">~</span>
            <a-input-number
              id="inputNumber"
              v-model="bitEndPosition"
              :min="bitStartPosition"
              @change="onChange"
            />
          </div>
          <div v-if="analysisType === 'drilling'">
            <span class="text-lg">钻头位置:</span>
            <a-input-number
              id="inputNumber"
              v-model="bitEndPosition"
              :min="0"
              @change="onChange"
            />
          </div>
          <div>
            <span class="text-lg">钻具组合：</span>
            <a-select style="width: 120px" v-model="BHA">
              <a-select-option value="1">
                第18趟钻
              </a-select-option>
            </a-select>
          </div>
          <div>
            <span class="text-lg">钻井液密度:</span>
            <a-input-number
              id="inputNumber"
              v-model="drillingFluidDensity"
              :min="0"
              @change="onChange"
            />
            <span>g/m³</span>
          </div>
          <div v-if="analysisType === 'drilling'">
            <span class="text-lg">摩阻系数:</span>
            <a-input-number
              id="inputNumber"
              :min="0"
              disabled
              :default-value="0.2"
            />
          </div>
          <div v-if="analysisType === 'drilling'">
            <span class="text-lg">钻压:</span>
            <a-input-number
              id="inputNumber"
              v-model="WOB"
              :min="0"
              @change="onChange"
            />
            <span>kN</span>
          </div>
          <div v-if="analysisType === 'drilling'">
            <span class="text-lg">钻头扭矩:</span>
            <a-input-number
              id="inputNumber"
              v-model="TOB"
              :min="0"
              @change="onChange"
            />
            <span>kN.m</span>
          </div>
        </div>
        <div class="flex gap-x-4">
          <a-dropdown placement="bottomCenter">
            <a-button>
              数据导出
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item v-if="analysisType === 'trip'">
                <div>
                  <ExportCsvButton
                    title="钩载路线图"
                    :csvData="hookCsvData"
                    :columns="hookColumn"
                  />
                </div>
              </a-menu-item>
              <a-menu-item v-if="analysisType === 'trip'">
                <div>
                  <ExportCsvButton
                    title="扭矩路线图"
                    :csvData="torqueCsvData"
                    :columns="torqueColumn"
                  />
                </div>
              </a-menu-item>

              <a-menu-item v-if="analysisType === 'drilling'">
                <div>
                  <ExportCsvButton
                    title="等效拉力-对钻压敏感性"
                    :csvData="axialForceCsvData"
                    :columns="axialForceColumn"
                  />
                </div>
              </a-menu-item>
              <a-menu-item v-if="analysisType === 'drilling'">
                <div>
                  <ExportCsvButton
                    title="侧向力-钻进扭矩"
                    :csvData="lateralForceAndTorqueCsvData"
                    :columns="lateralForceAndTorqueColumn"
                  />
                </div>
              </a-menu-item>
              <a-menu-item>
                <div>
                  <ExportCsvButton
                    title="井斜角-狗腿度"
                    :csvData="trajectoryData"
                    :columns="trajectoryColumn"
                  />
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <el-button
            type="primary"
            size="small"
            @click="
              () => {
                handleGetLatestData();
              }
            "
            >计算</el-button
          >
          <a-popover
            v-if="analysisType === 'trip'"
            title="摩阻系数预测"
            trigger="click"
          >
            <template slot="content">
              <div class="p-4" style="width: 500px">
                <TripSettingContent />
              </div>
            </template>
            <a-button>
              摩阻系数标定和预测
            </a-button>
          </a-popover>
        </div>
      </div>
      <div class="flex-1 flex gap-x-2" style="height: calc(100% - 60px)">
        <div
          style="width: 50px; background: #000c37d9"
          class="h-full flex flex-column"
        >
          <div
            style="height: 50%"
            class="flex justify-center text-lg align-center pointer"
            @click="
              () => {
                handleChangeDisplayType('trip');
              }
            "
          >
            <div
              :class="
                'p-4 h-full flex align-center ' +
                  (analysisType === 'trip' ? 'menuActive' : '')
              "
            >
              <span>起下钻分析</span>
            </div>
          </div>
          <div
            style="height: 50%"
            class="flex justify-center text-lg align-center pointer"
            @click="
              () => {
                handleChangeDisplayType('drilling');
              }
            "
          >
            <div
              :class="
                'p-4 h-full flex align-center ' +
                  (analysisType === 'drilling' ? 'menuActive' : '')
              "
            >
              钻进分析
            </div>
          </div>
        </div>
        <div
          class="border flex-1 flex p-4 shadow"
          style="background: rgb(17 89 175)"
        >
          <TripAnalysis
            v-if="analysisType === 'trip'"
            :hookData="hookData"
            :torqueData="torqueData"
            :trajectoryData="trajectoryData"
            :NHGZN="NHGZN"
          />
          <DrillingAnalysis
            v-if="analysisType === 'drilling'"
            :bucklingLimitData="bucklingLimitData"
            :trajectoryData="trajectoryData"
            :dragTorqueData="dragTorqueData"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import TripSettingContent from "@/components/TripSettingContent/TripSettingContent.vue";
import DrillingAnalysis from "../DrillingAnalysis/DrillingAnalysis.vue";
import TripAnalysis from "../TripAnalysis/TripAnalysis.vue";

import {
  getTrajectory,
  getWellStructure,
  getPipeStructure,
  getGjpzlist,
  hookLoad,
  torque,
  bucklingLimit,
  dragTorque,
  getNHGZN
} from "../../api/frictionTorqueAnalysisApi.js";
import { isArray } from "lodash";
import ExportCsvButton from "@/components/ExportCsvButton/ExportCsvButton.vue";
import {
  lateralForceAndTorqueColumn,
  axialForceColumn,
  trajectoryColumn,
  hookColumn,
  torqueColumn
} from "@/utils/csvExportColumn.js";

export default {
  components: {
    DrillingAnalysis,
    TripAnalysis,
    TripSettingContent,
    ExportCsvButton
  },
  name: "FrictionTorqueAnalysis",
  data() {
    return {
      hookCsvData: [],
      lateralForceAndTorqueCsvData: [],
      lateralForceAndTorqueColumn,
      axialForceCsvData: [],
      torqueCsvData: [],
      trajectoryColumn,
      axialForceColumn,
      hookColumn,
      torqueColumn,
      //trip 起下钻 drilling 钻进
      analysisType: "trip",
      wellNumber: "1",
      bitStartPosition: 0,
      bitEndPosition: 4000,
      WOB: 100000, // 钻压
      TOB: 15000, // 钻头扭矩
      BHA: "1",
      drillingFluidDensity: 1.7,
      spinning: false,

      hookData: {},
      torqueData: {},
      bucklingLimitData: {},

      trajectoryData: [],
      wellStructureData: [],
      pipeStructureData: [],
      gjpzlistData: [],
      dragTorqueData: [],
      // 实测点数据
      NHGZN: []
    };
  },
  mounted() {
    try {
      this.init();
    } catch (e) {
      this.$message.error("计算出错了，正在重试...");
      this.init();
    }
  },
  methods: {
    async init() {
      this.spinning = true;
      const trajectoryApiFn = getTrajectory();
      const wellStructureApiFn = getWellStructure();
      const pipeStructureApiFn = getPipeStructure();
      const gjpzlistApiFn = getGjpzlist();

      const res = await Promise.all([
        trajectoryApiFn,
        wellStructureApiFn,
        pipeStructureApiFn,
        gjpzlistApiFn
      ]);

      this.trajectoryData = res[0].data;
      this.wellStructureData = res[1];
      this.pipeStructureData = res[2];
      this.gjpzlistData = res[3];

      this.handleGetLatestData();
    },
    handleChangeDisplayType(currentType) {
      this.analysisType = currentType;
    },
    async handleGetLatestData() {
      this.spinning = true;
      function key2Lower(obj) {
        for (let key in obj) {
          let lowerCaseKey = key.toLowerCase();
          const strList = ["gk", "jth", "zjmc", "kzcx"];

          if (lowerCaseKey !== key) {
            obj[lowerCaseKey] = !strList.includes(lowerCaseKey)
              ? parseFloat(obj[key])
              : obj[key];
            delete obj[key];
          }
        }
        return obj;
      }

      const trajectoryData = JSON.stringify(
        this.trajectoryData.map(item => key2Lower(item))
      );
      const wellStructureData = JSON.stringify(
        this.wellStructureData.data.map(item => key2Lower(item))
      );
      const pipeStructureData = JSON.stringify(
        this.pipeStructureData.data.map(item => key2Lower(item))
      );
      const gjpzlistData = JSON.stringify(
        this.gjpzlistData.data.map(item => key2Lower(item))
      );

      const mud_densityJSON = JSON.stringify({ md: this.drillingFluidDensity });

      const getHookData = hookLoad({
        start_depth: this.bitStartPosition,
        end_depth: this.bitEndPosition,
        mud_density: mud_densityJSON,
        trajectory: trajectoryData,
        wellStructure: wellStructureData,
        pipeStructure: pipeStructureData,
        gjpzlist: gjpzlistData
      });
      const getTorque = torque({
        start_depth: this.bitStartPosition,
        end_depth: this.bitEndPosition,
        mud_density: mud_densityJSON,
        trajectory: trajectoryData,
        wellStructure: wellStructureData,
        pipeStructure: pipeStructureData,
        gjpzlist: gjpzlistData
      });

      const getBucklingLimit = bucklingLimit({
        end_depth: this.bitEndPosition,
        WOB: this.WOB,
        TOB: this.TOB,
        mud_density: mud_densityJSON,
        trajectory: trajectoryData,
        wellStructure: wellStructureData,
        pipeStructure: pipeStructureData,
        gjpzlist: gjpzlistData
      });

      const getDragTorque = dragTorque({
        end_depth: this.bitEndPosition,
        WOB: this.WOB,
        TOB: this.TOB,
        mud_density: mud_densityJSON,
        trajectory: trajectoryData,
        wellStructure: wellStructureData,
        pipeStructure: pipeStructureData,
        gjpzlist: gjpzlistData
      });

      const chartDataApiList = await Promise.all([
        getHookData,
        getTorque,
        getBucklingLimit,
        getDragTorque
      ]);

      this.handleGetNHGZN();

      // 接口返回的是一个数组（why？）
      this.hookData =
        isArray(chartDataApiList[0]) && chartDataApiList[0].length
          ? chartDataApiList[0][0]
          : [];
      this.torqueData =
        isArray(chartDataApiList[1]) && chartDataApiList[1].length
          ? chartDataApiList[1][0]
          : [];
      this.bucklingLimitData =
        isArray(chartDataApiList[2]) && chartDataApiList[2].length
          ? chartDataApiList[2][0]
          : [];
      this.dragTorqueData =
        isArray(chartDataApiList[3]) && chartDataApiList[3].length
          ? chartDataApiList[3][0]
          : [];

      this.hookCsvData = this.hookData.depth.map((item, index) => {
        return {
          depth: item,
          RotateFree:
            this.hookData.RotateFree.length > index
              ? this.hookData.RotateFree[index]
              : "",
          SlidingDownFF1:
            this.hookData.SlidingDownFF1.length > index
              ? this.hookData.SlidingDownFF1[index]
              : "",
          SlidingDownFF2:
            this.hookData.SlidingDownFF2.length > index
              ? this.hookData.SlidingDownFF2[index]
              : "",
          SlidingDownFF3:
            this.hookData.SlidingDownFF3.length > index
              ? this.hookData.SlidingDownFF3[index]
              : "",
          SlidingDownFF4:
            this.hookData.SlidingDownFF4.length > index
              ? this.hookData.SlidingDownFF4[index]
              : "",
          SlidingDownFF5:
            this.hookData.SlidingDownFF5.length > index
              ? this.hookData.SlidingDownFF5[index]
              : "",
          SlidingLiftingFF1:
            this.hookData.SlidingLiftingFF1.length > index
              ? this.hookData.SlidingLiftingFF1[index]
              : "",
          SlidingLiftingFF2:
            this.hookData.SlidingLiftingFF2.length > index
              ? this.hookData.SlidingLiftingFF2[index]
              : "",
          SlidingLiftingFF3:
            this.hookData.SlidingLiftingFF3.length > index
              ? this.hookData.SlidingLiftingFF3[index]
              : "",
          SlidingLiftingFF4:
            this.hookData.SlidingLiftingFF4.length > index
              ? this.hookData.SlidingLiftingFF4[index]
              : "",
          SlidingLiftingFF5:
            this.hookData.SlidingLiftingFF5.length > index
              ? this.hookData.SlidingLiftingFF5[index]
              : ""
        };
      });

      this.torqueCsvData = this.torqueData.depth.map((item, index) => {
        return {
          depth: item,
          FF1:
            this.torqueData.FF1.length > index
              ? this.torqueData.FF1[index]
              : "",
          FF2:
            this.torqueData.FF2.length > index
              ? this.torqueData.FF2[index]
              : "",
          FF3:
            this.torqueData.FF3.length > index
              ? this.torqueData.FF3[index]
              : "",
          FF4:
            this.torqueData.FF4.length > index
              ? this.torqueData.FF4[index]
              : "",
          FF5:
            this.torqueData.FF5.length > index ? this.torqueData.FF5[index] : ""
        };
      });

      this.lateralForceAndTorqueCsvData = this.dragTorqueData.depth.map(
        (item, index) => {
          return {
            depth: item,
            Torque:
              this.dragTorqueData.Torque.length > index
                ? this.dragTorqueData.Torque[index]
                : "",
            LateralForce:
              this.dragTorqueData.LateralForce.length > index
                ? this.dragTorqueData.LateralForce[index]
                : ""
          };
        }
      );

      this.axialForceCsvData = this.bucklingLimitData.depth1.map(
        (item, index) => {
          return {
            depth: item,
            AxialForce:
              this.bucklingLimitData.AxialForce.length > index
                ? this.bucklingLimitData.AxialForce[index]
                : "",
            HelBuckling_rotate:
              this.bucklingLimitData.HelBuckling_rotate.length > index
                ? this.bucklingLimitData.HelBuckling_rotate[index]
                : "",
            HelBuckling_slide:
              this.bucklingLimitData.HelBuckling_slide.length > index
                ? this.bucklingLimitData.HelBuckling_slide[index]
                : "",
            SinBuckling:
              this.bucklingLimitData.SinBuckling.length > index
                ? this.bucklingLimitData.SinBuckling[index]
                : ""
          };
        }
      );

      this.spinning = false;
    },
    async handleGetNHGZN() {
      const { data } = await getNHGZN();
      this.NHGZN = data;
    },
    onChange() {}
  }
};
</script>

<style scope>
.menuActive {
  background: #15c7e885;
}
</style>

<style lang="less">
.detail {
  background-size: 100% 40px !important;
}
.ant-spin {
  max-height: unset !important;
  transition: all 0.3s;
}

.frictionTorqueAnalysis {
  .ant-spin-nested-loading {
    height: 100%;
    .ant-spin-container {
      height: 100%;
    }
  }
}
</style>
