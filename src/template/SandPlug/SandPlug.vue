<template>
  <div class="SandPlug w-full h-full relative">
    <a-spin :spinning="false" tip="获取数据中...">
      <div class="px-4 h-full">
        <div class="flex z-10 pt-20 pb-4 h-full">
          <!-- <nav-menu-base /> -->
          <div class="flex" style="width: 100%">
            <div class="real-time bg-div" v-show="!isShowAllLog">
              <sand-plug-real-time :latestInfo="latestInfo" />
            </div>
            <div
              style="width: 60%; background-color: #000c37d9"
              class="mx-2"
              v-show="!isShowAllLog"
            >
              <div class="relative h-full">
                <div class="time bg-div">
                  <div class="flex time-item mb-2">
                    <div>当前时间:</div>
                    <div class="number ml-4 oneline">{{ dateTime }}</div>
                  </div>
                  <div class="flex time-item">
                    <div>压裂开始时间:</div>
                    <div class="number ml-4 oneline">
                      {{ dateValue.length ? dateValue[0] : undefined }}
                    </div>
                  </div>
                </div>
                <pressure-relationship-chart
                  :date-value="dateValue"
                  :construction-pressure-value="constructionPressureValue"
                  :sand-concentration-value="sandConcentrationValue"
                  :displacement-value="displacementValue"
                  :exist-error-date-value="existErrorDateValue"
                  :changeLatestInfo="changeLatestInfo"
                  :setIsRunning="setIsRunning"
                  :setCurrentId="setCurrentId"
                  :setCurrentType="setCurrentType"
                  :chartOriginData="chartOriginData"
                  :waitingTime="waitingTime"
                  :setWaitingTime="setWaitingTime"
                  :onGetCurrentWarningData="handleGetCurrentWarningData"
                  :sandPlugLogData="SandPlugLogData"
                />
              </div>
            </div>
            <div
              :style="isShowAllLog ? 'width: 100%;' : 'width: 30%;'"
              class="bg-div"
            >
              <div class="work" v-show="!isShowAllLog">
                <div class="title flex justify-between align-center">
                  <div>压裂实时工况</div>
                  <div class="drill-bit-menu pointer" @click="onMenuWork">
                    <img src="../../assets/menu.png" alt="" />
                  </div>
                </div>
                <div v-if="isShowWork" class="work-box">
                  <h2
                    class="text-30"
                    :class="currentType == 1 ? 'color-hight' : ''"
                  >
                    砂堵风险
                    <img
                      src="../../assets/alarm.png"
                      alt=""
                      class="alarm-img"
                      :class="currentType == 1 ? '' : 'unAlarm'"
                    />
                  </h2>
                  <div class="param-title px-4 mb-4">
                    <span>持续时间：{{ waitingTime }}</span>

                    <span class="ml-2">秒</span>
                  </div>
                  <div class="px-4 param-title">
                    现场接警：
                    <el-button
                      class="opt-btn"
                      :disabled="latestInfo.pre_RESULT != 1"
                      @click="handleConfirmWarningResult(1)"
                      >准确</el-button
                    >
                    <el-button
                      class="opt-btn wrong"
                      :disabled="latestInfo.pre_RESULT != 1"
                      @click="handleConfirmWarningResult(2)"
                      >误报</el-button
                    >
                  </div>
                </div>
              </div>
              <div
                class="log mt-2"
                :style="isShowWork ? 'height:70%;' : 'height:94%;'"
              >
                <div class="title flex justify-between align-center">
                  <div>风险日志</div>
                  <div class="flex">
                    <json-excel
                      :data="SandPlugLogData"
                      :fields="jsm_fields"
                      header="压裂风险日志统计"
                      name="压裂风险日志"
                      worksheet="压裂风险日志"
                      v-show="isShowAllLog && this.SandPlugLogData.length > 0"
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
                    </json-excel>
                    <el-tooltip
                      effect="dark"
                      :content="isShowAllLog ? '收起日志' : '展开日志'"
                      :open-delay="500"
                      placement="top"
                    >
                      <div @click="onCurrentLog">
                        <img
                          src="../../assets/hidden.png"
                          alt=""
                          v-show="!isShowAllLog"
                          class="export-btn"
                        />
                        <img
                          src="../../assets/show.png"
                          alt=""
                          v-show="isShowAllLog"
                          class="export-btn"
                        />
                      </div>
                    </el-tooltip>
                    <div class="drill-bit-menu pointer" @click="onMenuLog">
                      <img src="../../assets/menu.png" alt="" />
                    </div>
                  </div>
                </div>
                <div v-if="isShowLog">
                  <SandPlugRiskLog
                    :SandPlugLogData="SandPlugLogData"
                    :getWarningInfo="getWarningInfo"
                    :isShowAllLog="isShowAllLog"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import JsonExcel from "vue-json-excel";
import SandPlugRealTime from "../../components/SandPlugRealTime/SandPlugRealTime.vue";
import PressureRelationshipChart from "../../template/WellVisualizationCharts/PressureRelationshipChart/PressureRelationshipChart.vue";
import SandPlugRiskLog from "../../components/SandPlugRiskLog/SandPlugRiskLog.vue";
import {
  getFractureData,
  getSpRecord,
  getSpWarningLogList,
  getSpWarningSet,
  getSpCurrentWarning,
  confirmSpWarningResult
} from "../../api/SandPlugApi.js";
import { isArray, isEmpty } from "lodash";
export default {
  name: "SandPlug",
  components: {
    SandPlugRealTime,
    PressureRelationshipChart,
    SandPlugRiskLog,
    JsonExcel
  },
  data() {
    return {
      chartOriginData: [],
      isRunning: false,
      loading: true,
      initTimer: undefined,
      bgUrl: require("../../assets/bg-1.png"),
      SandPlugRealTimeData: {},
      isShowWork: true,
      dateValue: [],
      latestInfo: {
        time: undefined,
        pre_RESULT: undefined,
        total_PUMP_PRESSURE: 0, //泵压
        pumping_LIQUID_CONCENTRATION: 0, //砂浓度
        pumping_FLUID_VOLUME_TOTAL: 0, //液量
        total_PUMP_DISPL: 0, // 排量
        pumping_SAND_VOLUME: 0, //砂量
        serial_NUMBER: 0 //施工时间
      },
      constructionPressureValue: [],
      sandConcentrationValue: [],
      displacementValue: [],
      existErrorDateValue: [],
      SandPlugRealTimeDa: {},
      isShowWork: true,
      isShowLog: true,
      isShowAllLog: false, //是否展示全部日志
      waitingTime: 0,
      currentId: undefined,
      currentType: undefined,
      SandPlugLogData: [],
      jsm_fields: {
        时间: "time",
        类型: {
          field: "type",
          callback: value => {
            if (value == 1) {
              return "砂堵认";
            } else {
              return "其他";
            }
          }
        },
        状态: {
          field: "state",
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
      dateTime: "",
      timer: undefined,
      dateTimer: undefined,
      startTime: undefined
    };
  },
  async mounted() {
    this.dateTimer = setInterval(() => {
      this.dateTime = this.dayjs().format("YYYY-MM-DD HH:mm:ss");
    }, 1000);

    await this.mountedFn();
    this.getLoadData();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.dateTimer);
    clearInterval(this.initTimer);
  },
  methods: {
    getLoadData() {
      this.initTimer = setInterval(async () => {
        if (isEmpty(this.dateValue)) {
          await this.mountedFn();
        } else {
          clearInterval(this.initTimer);
          this.handleGetCurrentWarningData();
          this.loading = false;
        }
      }, 1000);
    },
    async mountedFn() {
      this.getFractureDataObj();
      // this.getWarningSetData()
      this.getCurrentWarning();
      this.getWarningInfo();
      await this.init();
    },
    changeLatestInfo(e) {
      this.latestInfo = e;
    },
    handleGetCurrentWarningData() {
      this.getCurrentWarning();
      this.getWarningInfo();
    },
    onMenuWork() {
      this.isShowWork = !this.isShowWork;
    },
    onMenuLog() {
      this.isShowLog = !this.isShowLog;
    },
    onCurrentLog() {
      this.isShowAllLog = !this.isShowAllLog;
    },
    //获取初始压裂信息值
    async getFractureDataObj() {
      const res = await getFractureData();
      if (res.success == true) {
        this.SandPlugRealTimeData = res.data;
      }
    },
    //获取告警参数
    // async getWarningSetData() {
    //   const res = await getSpWarningSet()
    //   if (res.success == true) {
    //     // this.waitingTime = res.data.waitingTime
    //   }
    // },
    //获取最新告警消息
    async getCurrentWarning() {
      const res = await getSpCurrentWarning();
      if (res.success == true) {
        if (res.data) {
          this.currentId = res.data.id;
          this.currentType = res.data.type;
        }
      }
    },
    //接警处理
    async handleConfirmWarningResult(status) {
      await this.getCurrentWarning();
      await confirmSpWarningResult({
        id: this.currentId,
        status //0-未确认 1-准确 2-误报
      });
      await this.getWarningInfo();
    },
    //获取风险日志
    async getWarningInfo() {
      const res = await getSpWarningLogList();
      if (res.success == true) {
        this.SandPlugLogData = res.data;
        const timer = setTimeout(() => {
          const table = document.querySelector(".el-table__body-wrapper");
          if (table) table.scrollTo({ top: table.scrollHeight });

          clearTimeout(timer);
        }, 50);
      }
    },
    async init() {
      const { data: chartInitData, success } = await getSpRecord();
      if (isArray(chartInitData) && success) {
        const dateValue = [];
        const constructionPressureValue = [];
        const sandConcentrationValue = [];
        const displacementValue = [];
        const existErrorDateValue = [];

        this.chartOriginData = chartInitData;
        chartInitData.forEach((data, index) => {
          dateValue.push(data.time);
          const timeStamp = this.dayjs(data.time).format("YYYY-MM-DD HH:mm:ss");
          constructionPressureValue.push([timeStamp, data.total_PUMP_PRESSURE]);
          sandConcentrationValue.push([
            timeStamp,
            data.pumping_LIQUID_CONCENTRATION
          ]);
          displacementValue.push([timeStamp, data.total_PUMP_DISPL]);

          if (data.pre_RESULT !== 0) {
            existErrorDateValue.push(data.time);
          }

          if (index == chartInitData.length - 1) {
            this.latestInfo = {
              time: data.time,
              pre_RESULT: data.pre_RESULT,
              total_PUMP_PRESSURE: data.total_PUMP_PRESSURE, //泵压
              pumping_LIQUID_CONCENTRATION: data.pumping_LIQUID_CONCENTRATION, //砂浓度
              pumping_FLUID_VOLUME_TOTAL: data.pumping_FLUID_VOLUME_TOTAL, //液量
              total_PUMP_DISPL: data.total_PUMP_DISPL, // 排量
              pumping_SAND_VOLUME: data.pumping_SAND_VOLUME, //砂量
              serial_NUMBER: data.serial_NUMBER //施工时间
            };
          }
        });

        this.dateValue = dateValue;
        this.constructionPressureValue = constructionPressureValue;
        this.sandConcentrationValue = sandConcentrationValue;
        this.displacementValue = displacementValue;
        this.existErrorDateValue = existErrorDateValue;
      }
    },
    setCurrentType(currentType) {
      this.currentType = currentType;
    },
    setCurrentId(currentId) {
      this.currentId = currentId;
    },
    setIsRunning(isRunning) {
      this.isRunning = isRunning;
    },
    setWaitingTime(waitingTime) {
      this.waitingTime = waitingTime;
    }
  }
};
</script>

<style lang="less">
@import "../../style/SandPlug.less";
</style>
