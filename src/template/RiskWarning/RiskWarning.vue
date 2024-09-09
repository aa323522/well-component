<template>
  <div class="RiskWarning w-full h-full relative">
    <div class="px-4 h-full">
      <div class="flex z-10 pt-20 pb-4 h-full">
        <!-- <nav-menu-base /> -->
        <div
          class="mx-2 bg-div width58 radius-6 flex flex-column"
          v-show="!isShowLog"
        >
          <div class="title flex align-center px-4 space-between">
            <div>
              <div class="line" />
              状态展示
            </div>
            <div>
              <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                  <span style="font-size: 14px;">X{{ speedValue }}</span
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
              <a-icon type="redo" class="pointer" @click="refresh" />
            </div>
          </div>
          <div class="h-full flex-1 flex">
            <depth-selection
              class="flex-1"
              :display-time="false"
              :display-mark="false"
              :well-depth-data="wellDepthData"
              :select-depth="selectDepth"
              @sliderConfirm="sliderChange"
            />
            <GemstoneChart
              :displayList="displayList"
              :depth="depth"
              :date="date"
              :depth-limit="depthLimit"
            />
          </div>
          <div style="height: 70px; font-size: 16px;" class="px-8 mb-1 flex">
            <div
              class="flex-1 flex justify-center align-center flex-column mx-2 h-full radius-20"
              style="background: #f0f8ff0f;;"
            >
              <div
                v-for="(item, index) in displayList[0]"
                :key="index"
                :style="`color: ${getColor(index)}`"
              >
                <span>{{ item.name }}</span
                >:
                {{ getArrayLast(item.chartData) }}
              </div>
            </div>
            <div class="flex-1 flex justify-center align-center">
              <div
                class="flex-1 flex justify-center align-center flex-column mx-2 h-full radius-20"
                style="background: #f0f8ff0f;"
              >
                <div
                  v-for="(item, index) in displayList[1]"
                  :key="index"
                  :style="`color: ${getColor(index)} !important`"
                >
                  <span>{{ item.name }}</span
                  >:
                  {{ getArrayLast(item.chartData) }}
                </div>
              </div>
            </div>
            <div class="flex-1 flex justify-center align-center">
              <div
                class="flex-1 flex justify-center align-center flex-column mx-2 h-full radius-20"
                style="background: #f0f8ff0f;;"
              >
                <div
                  v-for="(item, index) in displayList[2]"
                  :key="index"
                  :style="`color: ${getColor(index)}`"
                >
                  <span>{{ item.name }}</span
                  >:
                  {{ getArrayLast(item.chartData) }}
                </div>
              </div>
            </div>
            <div class="flex-1 flex justify-center align-center">
              <div
                class="flex-1 flex justify-center align-center flex-column mx-2 h-full radius-20"
                style="background: #f0f8ff0f;;"
              >
                <div
                  v-for="(item, index) in displayList[3]"
                  :key="index"
                  :style="`color: ${getColor(index)}`"
                >
                  <span>{{ item.name }}</span
                  >:
                  {{ getArrayLast(item.chartData) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="
            'mx-2 bg-div radius-6 overflow-y flex flex-column ' +
              (isShowLog ? 'w-full' : 'width42')
          "
        >
          <div v-show="!isShowLog" class="flex-1">
            <div class="title flex align-center space-between px-4">
              <div>
                <div class="line" />
                宝石风险
              </div>
              <div>
                <a-dropdown>
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item v-for="item in wellList" :key="item">
                      {{ item }}
                    </a-menu-item>
                  </a-menu>
                  <div
                    class="px-4 py-1"
                    style="background: linear-gradient(180deg, #080F26 0%, #0C1B4F 100%);font-size: 15px;"
                  >
                    {{ wellName }}
                  </div>
                </a-dropdown>
              </div>
            </div>
            <div class="flex mt-2 height-200">
              <div class="flex-1">
                <div class="text-center w-full text-lg">
                  溢流风险概率
                </div>
                <dashboard
                  id="overflowRisk"
                  :value="overflowProbability"
                ></dashboard>
              </div>
              <div class="flex-1">
                <div class="text-center w-full text-lg font-bold">
                  卡钻风险概率
                </div>
                <dashboard
                  id="jammingDrillingRisk"
                  :value="stickingProbability"
                ></dashboard>
              </div>
            </div>
          </div>
          <div
            class="z-10 relative flex flex-column"
            :class="isShowLog ? 'log-box-full' : 'log-content'"
          >
            <div class="title flex align-center justify-between px-4">
              <div class="flex-1">
                <div class="line" />
                风险日志
                <!-- <span class="well-number" v-if="riskLogData[0].wellId"
                  >井号：{{ riskLogData[0].wellId }}</span
                > -->
              </div>
              <div class="flex">
                <download-excel
                  :data="riskLogData"
                  :fields="jsm_fields"
                  header="风险日志统计"
                  name="风险日志"
                  worksheet="风险日志"
                  v-show="isShowLog && this.riskLogData.length > 0"
                >
                  <el-tooltip
                    effect="dark"
                    content="导出日志"
                    placement="top"
                    :open-delay="500"
                  >
                    <img
                      src="../../assets/export.png"
                      alt=""
                      class="export-btn"
                    />
                  </el-tooltip>
                </download-excel>
                <el-tooltip
                  effect="dark"
                  :content="isShowLog ? '收起日志' : '展开日志'"
                  :open-delay="500"
                  placement="top"
                >
                  <div @click="onCurrentLog">
                    <img
                      src="../../assets/hidden.png"
                      alt=""
                      v-show="!isShowLog"
                    />
                    <img
                      src="../../assets/show.png"
                      alt=""
                      v-show="isShowLog"
                    />
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div :class="isShowLog ? 'log-box-full' : 'log-box'">
              <riskLog
                type="riskWarning"
                :riskLogData="riskLogData"
                :getWarningInfo="getWarningInfo"
                :showLog="showLog"
                :isShowLog="isShowLog"
                @changeLimit="changeLimit"
              ></riskLog>
            </div>
          </div>
          <div v-show="!isShowLog" class="height-200">
            <div class="title flex align-center px-4">
              <div>
                <div class="line" />
                接警设置
              </div>
            </div>
            <div class="mx-2">
              <div class="flex justify-center">
                <h2
                  class="text-30 text-center"
                  :class="
                    currentType == 1 || currentType == 3 ? 'color-hight' : ''
                  "
                >
                  溢流
                  <img
                    src="../../assets/alarm.png"
                    alt=""
                    class="alarm-img"
                    :class="
                      currentType == 1 || currentType == 3 ? '' : 'unAlarm'
                    "
                  />
                </h2>
                <h2
                  class="text-30 text-center"
                  :class="
                    currentType == 2 || currentType == 3 ? 'color-hight' : ''
                  "
                >
                  卡钻
                  <img
                    src="../../assets/alarm.png"
                    alt=""
                    class="alarm-img"
                    :class="
                      currentType == 2 || currentType == 3 ? '' : 'unAlarm'
                    "
                  />
                </h2>
              </div>
              <div class="param-title">
                <span>报警逻辑：模型连续</span>
                <a-input-number
                  class="count"
                  v-model="alarmNum"
                  @change="setChange"
                />
                <span>次判断发生风险</span>
              </div>
              <div class="flex align-center justify-between">
                <div class="param-title">
                  <span>持续时间：</span>
                  <a-input-number
                    class="count"
                    v-model="waitingTime"
                    @change="setChange"
                  />
                  <span>分钟</span>
                </div>
                <div class="px-4 param-title">
                  现场接警：
                  <el-button
                    class="opt-btn"
                    :disabled="!currentId"
                    @click="handleConfirmWarningResult(1)"
                    >准确</el-button
                  >
                  <el-button
                    :disabled="!currentId"
                    class="opt-btn wrong"
                    @click="handleConfirmWarningResult(2)"
                    >误报</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavMenuBase from "../../components/navMenuBase/NavMenuBase.vue";
import Dashboard from "../../components/dashboard/Dashboard.vue";
import RiskLog from "../../components/riskLog/riskLog.vue";
import GemstoneChart from "../gemstoneChart/GemstoneChart.vue";
import DepthSelection from "../../components/depthSelection/DepthSelection";
import {
  getGemData,
  getWarningList,
  getWarningSet,
  setWarningParams,
  confirmWarningResult,
  getCurrentWarning,
  getUnconfirmWarningLog
} from "../../api/riskWarningApi.js";
import { getWellList } from "../../api/drillVisualizationApi.js";

import { last, max, min, cloneDeep, isArray } from "lodash";
export default {
  name: "RiskWarning",
  components: {
    NavMenuBase,
    Dashboard,
    RiskLog,
    GemstoneChart,
    DepthSelection
  },
  data() {
    return {
      isShowLog: false, //是否展示全部日志
      isAlarm: false, //接警设置是否报警
      riskLogData: [],
      jsm_fields: {
        井深: "js",
        时间: "time",
        异常状态: {
          field: "state",
          callback: value => {
            if (value == 1) {
              return "溢流";
            } else if (value == 2) {
              return "卡钻";
            } else if (value == 3) {
              return "溢流&卡钻";
            }
          }
        },
        是否操作: {
          field: "opt",
          callback: value => {
            if (value == 0) {
              return "未确认";
            } else if (value == 1) {
              return "准确";
            } else if (value == 2) {
              return "误报";
            }
          }
        },
        备注: "remark"
      },
      displayList: [[], [], [], []],
      depth: [],
      date: [],
      overflowProbability: 0,
      stickingProbability: 0,
      alarmNum: 0,
      waitingTime: 0,
      currentId: undefined,
      currentType: undefined,
      timer: undefined,
      depthLimit: [],
      wellDepthData: undefined,
      selectDepth: undefined,
      isInit: true,
      speedValue: 1,
      wellName: "",
      wellList: []
    };
  },
  computed: {
    getArrayLast() {
      return function(array) {
        return last(array);
      };
    },
    getColor() {
      return function(index) {
        if (index == 0) {
          return "#ff00c8";
        } else if (index == 1) {
          return "#00C2FF";
        } else if (index == 2) {
          return "#FFB700";
        }
      };
    }
  },
  watch: {
    depth: {
      handler(value) {
        if (isArray(value) && value.length >= 2 && this.isInit) {
          const obj = {};
          value.forEach(depth => {
            Object.assign(obj, { [depth]: {} });
          });
          this.wellDepthData = obj;
        }
        // this.isInit = false;
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.handleGetWellName();
    setTimeout(() => {
      this.createInterval();
      this.init();
      this.getCurrentWarning();
      this.getWarningInfo();
      this.getWarningSet();
    }, 300);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    createInterval() {
      this.timer = setInterval(() => {
        this.init();
        this.getCurrentWarning();
        this.getWarningInfo();
        this.getUnconfirmWarningLog();
      }, 30000);
    },
    async init() {
      const isInit = this.depth.length === 0;
      const res = await getGemData({
        wellDepth: !isInit ? this.depth[this.depth.length - 1] : undefined,
        wellName: this.wellName
      });

      if (res.success === true) {
        const depth = [];
        const date = [];
        const standpipe_PRESSURE = [];
        const flow_OUT = [];
        const flow_IN = [];
        const cal_PP = [];
        const pre_PP = [];
        const pre_WOB = [];
        const pre_Torque = [];
        const pre_coefficient = [];
        const pre_data = [];
        const pro_kick = [];
        (res.data || []).forEach(item => {
          depth.push(item.well_DEPTH);
          date.push(item.time);

          standpipe_PRESSURE.push(Number(item.standpipe_PRESSURE.toFixed(2)));
          flow_OUT.push(Number(item.flow_OUT.toFixed(2)));
          flow_IN.push(Number(item.flow_IN.toFixed(2)));
          cal_PP.push(Number(item.cal_PP.toFixed(2)));
          pre_PP.push(Number(item.pre_PP.toFixed(2)));
          pre_WOB.push(Number(item.pre_WOB.toFixed(2)));
          pre_Torque.push(Number(item.pre_Torque.toFixed(2)));
          pre_coefficient.push(
            item.pre_coefficient > 0 ? item.pre_coefficient : 0
          );
          pre_data.push(0.4);
          pro_kick.push(Number(item.pro_kick.toFixed(2)));
        });
        if (isInit) {
          const displayList = [
            [
              {
                name: "立管压力",
                unit: "MPa",
                chartData: standpipe_PRESSURE
              },
              {
                name: "出口流量",
                unit: "L/min",
                chartData: flow_OUT
              },
              {
                name: "入口流量",
                unit: "L/min",
                chartData: flow_IN
              }
            ],
            [
              {
                name: "孔隙压力计算值",
                unit: "g/cm³",
                chartData: cal_PP
              },
              {
                name: "孔隙压力预测值",
                unit: "g/cm³",
                chartData: pre_PP
              }
            ],
            [
              {
                name: "钻压",
                unit: "tone",
                chartData: pre_WOB
              },
              {
                name: "扭矩",
                unit: "kn.m",
                chartData: pre_Torque
              }
            ],
            [
              {
                name: "摩阻系数",
                unit: "",
                chartData: pre_coefficient
              },
              {
                name: "上限",
                unit: "",
                chartData: pre_data,
                lineType: "dashed",
                color: "#f5eeee"
              }
            ]
          ];
          this.displayList = displayList.map(item => {
            return item.map(data => ({
              ...data,
              max: data.name == "摩阻系数" ? 1 : max(data.chartData),
              min: data.name == "摩阻系数" ? 0 : min(data.chartData)
            }));
          });
          this.depth = depth;
          this.date = date;

          this.overflowProbability = Math.trunc(
            Number(last(pro_kick).toFixed(2) * 100)
          );

          const coefficientData = displayList[3][0].chartData;
          this.stickingProbability =
            last(coefficientData) > 0
              ? Math.trunc(Number(last(coefficientData) * 100))
              : 0;
        } else {
          const displayList = cloneDeep(this.displayList);
          this.depth = [...this.depth, ...depth];
          this.date = [...this.date, ...date];
          displayList[0][0].chartData.push(...standpipe_PRESSURE);
          displayList[0][1].chartData.push(...flow_OUT);
          displayList[0][2].chartData.push(...flow_IN);

          displayList[1][0].chartData.push(...cal_PP);
          displayList[1][1].chartData.push(...pre_PP);

          displayList[2][0].chartData.push(...pre_WOB);
          displayList[2][1].chartData.push(...pre_Torque);

          displayList[3][0].chartData.push(...pre_coefficient);
          displayList[3][1].chartData.push(...pre_data);

          this.displayList = displayList.map(item => {
            return item.map(data => ({
              ...data,
              max: data.name == "摩阻系数" ? 1 : max(data.chartData),
              min: data.name == "摩阻系数" ? 0 : min(data.chartData)
            }));
          });
        }
      }
    },
    async getWarningInfo() {
      this.riskLogData = [];
      const res = await getWarningList({ wellName: this.wellName });
      if (res.success == true) {
        this.riskLogData = res.data.map(item => {
          return {
            js: item.wellDepth,
            time: item.time,
            state: item.type,
            opt: item.status,
            remark: item.remark,
            id: item.id,
            wellId: item.wellId
          };
        });

        const timer = setTimeout(() => {
          const table = document.querySelector(".el-table__body-wrapper");
          if (table) table.scrollTo({ top: table.scrollHeight });

          clearTimeout(timer);
        }, 50);
      }
    },
    async getWarningSet() {
      const res = await getWarningSet({ wellName: this.wellName });

      if (res.success == true) {
        this.alarmNum = res.data.alarmNum;
        this.waitingTime = res.data.waitingTime;
      }
    },
    async getUnconfirmWarningLog() {
      const res = await getUnconfirmWarningLog({ wellName: this.wellName });
      if (res.success == true) {
        const data = res.data;
        this.riskLogData.push({
          js: data.wellDepth,
          time: data.time,
          state: data.type,
          opt: data.status,
          remark: data.remark,
          id: data.id,
          wellId: data.wellId
        });
      }
    },
    onCurrentLog() {
      this.isShowLog = !this.isShowLog;
      if (!this.isShowLog) {
        const timer = setTimeout(() => {
          const table = document.querySelector(".el-table__body-wrapper");
          if (table) table.scrollTo({ top: table.scrollHeight });
          clearTimeout(timer);
        }, 50);
      }
    },
    setChange() {
      setWarningParams({
        alarmNum: this.alarmNum,
        waitingTime: this.waitingTime,
        wellName: this.wellName
      });
    },
    async getCurrentWarning() {
      const res = await getCurrentWarning({ wellName: this.wellName });
      if (res.success == true) {
        if (res.data) {
          this.currentId = res.data.id;
          this.currentType = res.data.type;
        }
      }
    },
    async handleConfirmWarningResult(status) {
      await confirmWarningResult({
        id: this.currentId,
        status,
        wellName: this.wellName
      });
      this.currentId = undefined;
      this.currentType = undefined;
      this.getWarningInfo();
      this.getCurrentWarning();
    },
    showLog(value) {
      this.isShowLog = value;
    },
    refresh() {
      this.selectDepth = this.depthLimit;
      this.depthLimit = undefined;
      this.handleGetWellName();
      setTimeout(() => {
        this.init();
        this.getCurrentWarning();
        this.getWarningInfo();
      }, 250);
    },
    sliderChange(e) {
      this.depthLimit = e;
    },
    changeLimit(selectedDepth) {
      const findIndex = this.depth.findIndex(item => item === selectedDepth);

      if (findIndex !== -1 && this.depth.length >= 3) {
        if (findIndex == 0) {
          this.depthLimit = [selectedDepth, this.depth[2]];
          this.selectDepth = [selectedDepth, this.depth[2]];
        } else if (findIndex == this.depth.length) {
          this.depthLimit = [this.depth[findIndex - 2], selectedDepth];
          this.selectDepth = [this.depth[findIndex - 2], selectedDepth];
        } else {
          this.depthLimit = [
            this.depth[findIndex - 1],
            this.depth[findIndex + 1]
          ];
          this.selectDepth = [
            this.depth[findIndex - 1],
            this.depth[findIndex + 1]
          ];
        }
      } else {
        this.depthLimit = [selectedDepth, selectedDepth];
        this.selectDepth = [selectedDepth, selectedDepth];
      }
    },
    changeSpeed(multiplier) {
      clearInterval(this.timer);
      this.speedValue = multiplier;
      this.setSpeedRadio(multiplier);
    },
    setSpeedRadio(speedRadio) {
      this.speedRadio = speedRadio;
      this.timer = setInterval(() => {
        this.init();
      }, 10000 / speedRadio);
    },
    async handleGetWellName() {
      const { success, data } = await getWellList();
      if (success != true && !isEmpty(data)) return;
      this.wellList = data;
      this.wellName = data[0];
    },
    handleMenuClick(e) {
      clearInterval(this.timer);
      this.wellName = e.key;
      this.depth.length = 0;
      this.getCurrentWarning();
      this.getWarningInfo();
      this.init();
      this.getUnconfirmWarningLog();
      this.createInterval();
    }
  }
};
</script>

<style lang="less">
@import "../../style/RiskWarning.less";
</style>
