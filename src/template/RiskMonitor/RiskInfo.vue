<template>
  <div class="main pt-20 riskInfo h-full pb-4 flex">
    
    <div class="main-left">
      <div style="minWidth: 270px">
        <RightTitle :title="'工程参数'" class="paramsTitle" />
        <div class="data-box gap-x-2 gap-y-2 grid py-1 px-2">
          <div
            class="data-item"
            v-for="item in this.state.dataList"
            :key="item.title"
          >
            <div class="item-top">{{ item.title }}</div>
            <div class="item-num" :style="`color: ${item.color}`">
              {{ item.num }}
            </div>
          </div>
        </div>
        <RightTitle :title="'钻井液性能参数'" />
        <div class="data-box gap-x-2 gap-y-2 grid py-1 px-2">
          <div
            class="data-item"
            v-for="item in this.state.dataList2"
            :key="item.title"
          >
            <div class="item-top">{{ item.title }}</div>
            <div class="item-num" :style="`color: ${item.color}`">
              {{ item.num }}
            </div>
          </div>
        </div>
        <RightTitle :title="'参数推荐'" />
        <div style="fontSize: 22px; fontWeight: bold" class="pt-1 mx-2">
          <div>起钻速度: 1-2</div>
          <div>下钻速度: 3-4</div>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div class="chartLeft h-full pb-4 gap-x-2">
        <div
          class="h-full flex flex-column gap-y-2 flex-1"
          style="min-width: 1100px; height: 100%; position: relative"
        >
          <div class="right-title">
            <div>
              <div class="title-text !flex align-center gap-x-2">
                井名：
                <WellDropDown :wellName="wellId" :setWellName="setWellId" />
                <ExportCsvButton
                  exportForTime
                  style="fontSize: 16px"
                  :columns="riskInfoColumn"
                  :csvData="modalUpdateOriginData"
                  :createCsvData="createCsvData"
                />
              </div>
            </div>
            <div class="flex gap-x-2 align-center">
              <ModalUpdateButton
                :modalUpdateOriginData="modalUpdateOriginData"
                :depthList="depthList"
              />
              <a-button type="danger" @click="resetData">重置数据</a-button>
            </div>
          </div>
          <div class="flex flex-1 ml-2">
            <div class="charLineOne flex flex-column h-full mt-2">
              <div
                style="
                  height: 1px;
                  background: rgba(51, 51, 51, 0.3);
                  width: 100%;
                  position: absolute;
                  top: 200px;
                "
              ></div>
              <div class="chartLegend">
                <div class="item flex gap-x-2">
                  <div>时间</div>
                  <div>深度</div>
                </div>
              </div>
              <div class="flex flex-column h-full justify-between">
                <depthSelection
                  class="flex-1"
                  :display-time="false"
                  :display-mark="true"
                  :well-depth-data="wellDepthData"
                />
              </div>
            </div>
            <div class="h-full flex flex-column" style="width: 100px">
              <div class="flex align-end justify-center" style="height: 146px">
                <span class="text-lg text-bold"> 钻井工况 </span>
              </div>
              <div class="charBarEight h-full flex flex-1">
                <div class="drillingConditionChart h-full w-full"></div>
              </div>
            </div>
            <div class="flex gap-x-1">
              <riskInfoChart
                :headerItemList="state.args_engineering"
                :depthList="depthList"
                :displayList="displayList1"
                chartId="riskChart-1"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
              <riskInfoChart
                :headerItemList="state.args_pool"
                :depthList="depthList"
                :displayList="displayList2"
                chartId="riskChart-2"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
              <riskInfoChart
                :headerItemList="state.args_well_drilling"
                :depthList="depthList"
                :displayList="displayList3"
                chartId="riskChart-3"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
              <riskInfoChart
                :headerItemList="state.args_gas"
                :depthList="depthList"
                :displayList="displayList4"
                chartId="riskChart-4"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
              <riskInfoChart
                :headerItemList="state.lineColorArrFive"
                :depthList="depthList"
                :displayList="displayList5"
                chartId="riskChart-5"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
              <riskInfoChart
                :headerItemList="state.lineColorArrSix"
                :depthList="depthList"
                :displayList="displayList6"
                chartId="riskChart-6"
                :chartZoomStart="chartZoomStart"
                :chartZoomEnd="chartZoomEnd"
                :setChartZoomStart="setChartZoomStart"
                :setChartZoomEnd="setChartZoomEnd"
                :setDisplayList="setDisplayList"
                :bitDepthList="bitDepthList"
              />
            </div>
          </div>
        </div>
        <div class="h-full" style="width: 240px;">
          <div class="w-full h-full flex flex-column">
            <div>
              <RightTitle :title="getConditionTitle()" class="paramsTitle">
                <img
                  v-if="Object.keys(this.errorMap).length"
                  src="../../assets/alarm.png"
                  alt=""
                  style="height: 40px; width: 40px"
                />
              </RightTitle>
            </div>
            <div>
              <div
                class="flex space-between align-center text-24 p-2"
                style="background: #0e497d"
              >
                <div>风险日志</div>
                <div>
                  <a-icon type="dashboard" @click="handleOpenTable" />
                </div>
              </div>
            </div>
            <div style="height: calc(100% - 100px);">
              <div style="width: 100%; height: 24%" class="flex flex-column">
                <div
                  class="text-center"
                  style="fontSize: 22px; fontweight: bold"
                >
                  溢流风险概率
                </div>
                <dashboard
                  isRisk
                  class="flex-1 w-full h-full"
                  id="jammingDrillingRisk1"
                  :value="kickValue"
                />
              </div>
              <div style="width: 100%; height: 24%" class="flex flex-column">
                <div
                  class="text-center"
                  style="fontSize: 22px; fontweight: bold"
                >
                  井漏风险概率
                </div>
                <dashboard
                  isRisk
                  class="flex-1 w-full h-full"
                  id="jammingDrillingRisk2"
                  :value="labelLostValue"
                />
              </div>
              <div style="width: 100%; height: 24%" class="flex flex-column">
                <div
                  class="text-center"
                  style="fontSize: 22px; fontweight: bold"
                >
                  卡钻风险概率
                </div>
                <dashboard
                  isRisk
                  class="flex-1 w-full h-full"
                  id="jammingDrillingRisk3"
                  :value="stuckValue"
                />
              </div>
              <div style="width: 100%; height: 24%" class="flex flex-column">
                <div
                  class="text-center"
                  style="fontSize: 22px; fontweight: bold"
                >
                  硫化氢
                </div>
                <dashboard
                  isRisk
                  class="flex-1 w-full h-full"
                  id="jammingDrillingRisk4"
                  :value="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal v-model="tableVisible" width="50%" wrapClassName="riskModal">
      <RiskLog :riskLogData="riskLogData" type="riskInfo" />
    </a-modal>
    <a-modal
      v-model="confirmVisible"
      :title="`已确认${
        currentData ? currentData.type : ''
      }风险发生，请选择起始时间`"
      @ok="handleRisk"
    >
      <a-range-picker
        :locale="locale"
        :show-time="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
        :placeholder="['起始时间', '结束时间']"
        v-model="selectTime"
      />
    </a-modal>
  </div>
</template>
<script>
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import RiskLog from "../../components/riskLog/riskLog.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import "echarts/lib/chart/scatter";

import * as echarts from "echarts";
import {
  getRiskCurrentData,
  getRiskData,
  clearRecord,
  getWarningLogList,
  getUnconfirmedLogList,
  saveWarningLog,
  getStuck
} from "../../api/riskInfoApi.js";

import { riskInfoColumn } from "@/utils/csvExportColumn.js";
import RightTitle from "@/components/RightTitle/RightTitle.vue";
import RiskHeaderItem from "@/components/RiskHeaderItem/RiskHeaderItem.vue";
import DepthSelection from "@/components/depthSelection/DepthSelection";
import { landLayerMapping } from "../../utils/utils.js";
import { cloneDeep, isEmpty, max, min, floor } from "lodash";
import RiskConfirmContent from "@/components/RiskConfirmContent/RiskConfirmContent.vue";
import RiskInfoChart from "@/template/RiskInfoChart/RiskInfoChart.vue";
import ModalUpdateButton from "../ModalUpdateButton/ModalUpdateButton.vue";
import WellDropDown from "@/components/WellDropDown/WellDropDown.vue";
import ExportCsvButton from "@/components/ExportCsvButton/ExportCsvButton.vue";

const colorList = [
  "#F59A23",
  "#a1af2f",
  "#8400FF",
  "#3F85ED",
  "#95F202",
  "red",
];

const conditionBarMap = {
  "-1": "未知",
  0: "下钻",
  1: "起钻",
  2: "划眼",
  3: "倒划眼",
  4: "循环",
  5: "钻进",
  6: "关井停钻",
  7: "卡钻/接单根",
};
export default {
  name: "riskInfo",
  components: {
    RightTitle,
    Dashboard,
    RiskHeaderItem,
    DepthSelection,
    RiskLog,
    RiskInfoChart,
    ModalUpdateButton,
    WellDropDown,
    ExportCsvButton,
  },
  watch: {
    wellId: {
      handler(value) {
        if (!value) return;
        clearTimeout(this.timer);
        clearInterval(this.timer)
        this.$message.destroy();
        this.init();
      },
    },
  },
  computed: {
    getConditionTitle() {
      return function () {
        if (this.errorMap["溢流&卡钻"]) return "溢流&卡钻";
        if (this.errorMap["溢流"]) return "溢流";
        if (this.errorMap["卡钻"]) return "卡钻";

        if (isEmpty(this.conditionBarData)) return "";

        return conditionBarMap[
          this.conditionBarData[this.conditionBarData.length - 1]
        ];
      };
    },
  },
  data() {
    return {
      bitDepthList: [],
      isLoadingApi: true,
      csvData: [],
      riskInfoColumn,
      conditionBarData: [],
      currentData: undefined,
      locale,
      confirmVisible: false,
      riskLogData: [],
      tableVisible: false,
      drillingConditionColorMap: {
        0: "#CCFF66",
        1: "#375623",
        2: "#548235",
        3: "#A9D08E",
        4: "#C6E0B4",
        5: "#E2EFDA",
        6: "#009900",
        7: "#669900",
        8: "#33CC33",
      },
      displayList1: [],
      displayList2: [],
      displayList3: [],
      displayList4: [],
      displayList5: [],
      displayList6: [],
      state: {
        dataList: [
          {
            title: "井深(m)",
            type: "depth",
            num: 0,
          },
          {
            title: "钻头位置(m)",
            // title: "钻头位置[m]",
            type: "location",
            num: 0,
          },
          {
            title: "转盘转速(rpm)",
            // title: "迟到深度[m]",
            type: "late_depth",
            num: 0,
          },
          {
            // title: "大钩负荷[kN]",
            title: "大钩负荷(t)",
            type: "hook_load",
            num: 0,
            color: colorList[1],
          },
          {
            title: "钻压(t)",
            // title: "大钩高度[m]",
            type: "hook_height",
            num: 0,
            color: colorList[2],
          },
          {
            title: "扭矩(kn.m)",
            // title: "钻压[kN]",
            type: "bit_weight",
            num: 0,
            color: colorList[3],
          },
          {
            title: "立管压力(MPa)",
            // title: "转盘转速[rpm]",
            type: "turnplate_speed",
            num: 0,
            color: colorList[0],
          },
          {
            title: "钻速(m/h)",
            type: "turnplate_torque",
            num: 0,
            color: colorList[1],
          },
          {
            title: "累积泵冲(spm)",
            type: "riser_pressure",
            num: 0,
            color: colorList[2],
          },
          {
            title: "总池体积(m³)",
            // title: "套管压力[MPa]",
            type: "chp_pressure",
            num: 0,
            color: colorList[3],
          },
          {
            // title: "入口流量[l/min]",
            title: "入口流量(L/min)",
            type: "inlet_flow",
            num: 0,
            color: colorList[2],
          },
          {
            title: "出口流量(%)",
            type: "export_flow",
            num: 0,
            color: colorList[3],
          },
        ],
        dataList2: [
          {
            title: "入口电导(mS/cm)",
            type: "inlet_electrical",
            num: 0,
            color: colorList[4],
          },
          {
            title: "出口电导(mS/cm)",
            // title: "出口电导[S/m]",
            type: "export_electrical",
            num: 0,
            color: colorList[5],
          },
          {
            title: "入口温度(°C)",
            type: "mud_temp_in",
            num: 0,
            color: colorList[1],
          },
          {
            title: "出口温度(°C)",
            type: "mud_temp_out",
            num: 0,
            color: colorList[2],
          },
        ],
        args_engineering: [
          {
            color: "#F59A23",
            name: "大钩高度",
            min: 0,
            max: 3100,
            flag_value: "hook_height",
            data_key: "100",
          },
          {
            color: "#a1af2f",
            name: "大钩负荷",
            min: 0,
            max: 700,
            flag_value: "hook_load",
            data_key: "101",
          },
          {
            color: "#8400FF",
            name: "钻压",
            min: 0,
            max: 200,
            flag_value: "bit_weight",
            data_key: "102",
          },
          {
            color: "#3F85ED",
            name: "扭矩",
            min: 0,
            max: 200,
            flag_value: "turnplate_torque",
            data_key: "103",
          },
          {
            color: "#95F202",
            name: "转速",
            min: 0,
            max: 200,
            flag_value: "turnplate_speed",
            data_key: "104",
          },
          {
            color: "red",
            name: "钻时",
            min: 0,
            max: 400,
            flag_value: "turnplate_time",
            data_key: "105",
          },
        ],
        args_pool: [
          {
            color: colorList[0],
            name: "立管压力",
            min: 0,
            max: 50,
            flag_value: "riser_pressure",
            data_key: "200",
          },
          {
            color: colorList[1],
            name: "钻速",
            min: 0,
            max: 50,
            flag_value: "chp_pressure",
            data_key: "201",
          },
          {
            color: colorList[2],
            name: "累积泵冲",
            min: 0,
            max: 200,
            flag_value: "pumping",
            data_key: "202",
          },
          {
            color: colorList[3],
            name: "总池体积",
            min: 0,
            max: 350,
            flag_value: "overall",
            data_key: "203",
          },
          {
            color: colorList[4],
            name: "池体积1",
            min: 0,
            max: 50,
            flag_value: "pool_1",
            data_key: "204",
          },
          {
            color: colorList[5],
            name: "池体积2",
            min: 0,
            max: 100,
            flag_value: "pool_2",
            data_key: "205",
          },
        ],
        args_well_drilling: [
          {
            color: colorList[0],
            name: "入口密度",
            min: 0,
            max: 3,
            flag_value: "inlet_density",
            data_key: "300",
          },
          {
            color: colorList[1],
            name: "出口密度",
            min: 0,
            max: 3,
            flag_value: "export_density",
            data_key: "301",
          },
          {
            color: colorList[2],
            name: "入口流量",
            min: 0,
            max: 100,
            flag_value: "inlet_flow",
            data_key: "302",
          },
          {
            color: colorList[3],
            name: "出口流量",
            min: 0,
            max: 100,
            flag_value: "export_flow",
            data_key: "303",
          },
          {
            color: colorList[4],
            name: "正丁烷",
            min: 0,
            max: 100,
            flag_value: "nC4H10",
            data_key: "404",
          },
          {
            color: colorList[5],
            name: "正戊烷",
            min: 0,
            max: 100,
            flag_value: "nC5H12",
            data_key: "405",
          },
        ],
        args_gas: [
          {
            color: colorList[0],
            name: "全烃",
            min: 0,
            max: 100,
            flag_value: "HC",
            data_key: "400",
          },
          {
            color: colorList[1],
            name: "甲烷",
            min: 0,
            max: 100,
            flag_value: "CH4",
            data_key: "401",
          },
          {
            color: colorList[2],
            name: "乙烷",
            min: 0,
            max: 100,
            flag_value: "C2H6",
            data_key: "402",
          },
          {
            color: colorList[3],
            name: "丙烷",
            min: 0,
            max: 100,
            flag_value: "C3H8",
            data_key: "403",
          },
          {
            color: colorList[4],
            name: "入口电导",
            min: 0,
            max: 150,
            flag_value: "inlet_electrical",
            data_key: "304",
          },
          {
            color: colorList[5],
            name: "出口电导",
            min: 0,
            max: 150,
            flag_value: "export_electrical",
            data_key: "305",
          },
        ],
        lineColorArrFive: [
          {
            color: colorList[0],
            name: "地层压力",
            min: 0,
            max: 3000,
            data_key: "500",
          },
          {
            color: colorList[1],
            name: "井底压力",
            min: 0,
            max: 300,
            data_key: "501",
          },
          {
            color: colorList[2],
            name: "流量差",
            min: 0,
            max: 300,
            data_key: "501",
          },
          {
            color: colorList[3],
            name: "溢流概率",
            min: 0,
            max: 100,
            data_key: "501",
          },
          {
            color: colorList[4],
            name: "井漏概率",
            min: 0,
            max: 100,
            data_key: "501",
          },
        ],
        lineColorArrSix: [
          {
            color: colorList[0],
            name: "摩阻系数",
            min: 0,
            max: 100,
            data_key: "600",
          },
          {
            color: colorList[1],
            name: "卡钻概率",
            min: 0,
            max: 100,
            data_key: "601",
          },
        ],
        conditionBarData: [],
      },
      // 纵轴深度
      depthList: [],
      // 每一个深度下的具体数据对象
      wellDepthData: {},
      // 层级列表
      horizonName: [],
      // 当前深度
      currentDepth: 0,
      // 当前时间
      currentTime: undefined,
      // 5秒一次查询定时器的timer，离开时清除用
      timer: undefined,
      // 溢流风险概率
      kickValue: 0,
      // 井漏风险概率
      labelLostValue: 0,
      // 卡钻风险概率
      stuckValue: 0,
      errorMap: {},
      closeFn: () => {},
      selectTime: undefined,
      chartZoomStart: 100,
      chartZoomEnd: undefined,
      modalUpdateOriginData: [],
      wellId: undefined,
    };
  },
  destroyed() {
    this.isLoadingApi = false;
    clearTimeout(this.timer);
    clearInterval(this.timer)
    this.$message.destroy();
  },
  methods: {
    createCsvData(data) {
      const createdData = data.map((item) => {
        const warningLogDTO = item.warningLogDTO
          ? {
              status:
                item.warningLogDTO.status == 0
                  ? "未确认"
                  : item.warningLogDTO.status == 1
                  ? "准确"
                  : item.warningLogDTO.status == 2
                  ? "误报"
                  : "无",
              remark: item.warningLogDTO.remark || "无", // 备注
              type: item.warningLogDTO.type, // 风险类型
            }
          : {};

        return {
          ...item,
          ...warningLogDTO,
          kick: `${item.kick}%`, // 溢流风险
          labelLostRisk: `${item.labelLostRisk}%`, // 井漏风险
          stuck: `${item.stuck}%`, // 卡钻概率
        };
      });

      return createdData;
    },
    setWellId(value) {
      this.wellId = value;
    },
    setChartZoomStart(value) {
      this.chartZoomStart = value;
    },
    setChartZoomEnd(value) {
      this.chartZoomEnd = value;
    },
    setConfirmVisible(value) {
      this.confirmVisible = value;
    },
    async handleRisk() {
      if (!this.selectTime) return;

      const startTime = this.dayjs(this.selectTime[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const endTime = this.dayjs(this.selectTime[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      
      const params = {
        ...this.currentData,
        id: undefined,
        status: this.status,
        startTime: startTime,
        endTime: endTime,
        status: 1,
        time: this.dayjs(this.currentData.time).format("YYYY-MM-DD HH:mm:ss")
      };

      await saveWarningLog(params);

      this.getUnconfirmedLog();
      this.confirmVisible = false;
    },
    createMessage(data) {
      const time = this.dayjs(data.date).format("YYYY-MM-DD\nHH:mm:ss");
      const type = data.type;

      const currentData = {
        id: data.id,
        wellId: this.wellId,
        wellDepth: data.wellDepth,
        type: data.type,
        time: time,
        remark: "",
        startTime: this.dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
        endTime: this.dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
      };
      this.currentData = currentData;
      const closeFn = this.$message.error({
        duration: 0,
        getContainer: () => document.querySelector(".riskInfo"),
        top: "60px",
        content: (h) => {
          const text = h(
            "span",
            {},
            `${time} 井深:${data.wellDepth}m 发生 ${type} 风险`
          );
          const icon = h(RiskConfirmContent, {
            props: {
              getCurrentErrorFn: this.getUnconfirmedLog,
              closeFn: closeFn,
              confirmVisible: this.confirmVisible,
              setConfirmVisible: this.setConfirmVisible,
              currentData,
            },
          });

          return [text, icon];
        },
      });

      return closeFn;
    },
    async handleOpenTable() {
      const { data } = await getWarningLogList();
      // 多种错误类型，API应直接返回状态码比较好
      const errorMap = {
        溢流: 1,
        卡钻: 2,
        "溢流&卡钻": 3,
      };
      const res = data.map((item) => {
        return {
          ...item,
          js: item.wellDepth,
          opt: item.status,
          state: errorMap[item.type],
          time: this.dayjs(item.time).format("YYYY-MM-DD\nHH:mm"),
        };
      });
      this.riskLogData = res;
      this.tableVisible = true;
    },
    async resetData() {
      await clearRecord();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    createBar() {
      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
        xAxis: {
          type: "category",
          show: false,
          data: [""],
        },
        tooltip: {
          showDelay: 0,
          width: 100,
          transitionDuration: 0,
        },
        yAxis: {
          type: "value",
          show: false,
          splitNumber: 200,
          inverse: true,
        },
        series: this.horizonName.map((item, index) => ({
          name: item.name,
          type: "bar",
          stack: "Total",
          label: false,
          z: index,
          itemStyle: {
            borderColor: landLayerMapping[item.name].color,
          },
          color: landLayerMapping[item.name].color,
          data: [item.depth],

          animationDuration: 0,
        })),
      };
      const chartDom1 = document.getElementsByClassName("charBarTwo")[0];
      const echart1 = echarts.init(chartDom1);

      const chartDom3 = document.getElementsByClassName("charBar33")[0];
      const echart3 = echarts.init(chartDom3);

      echart1.setOption(option, true);
      echart3.setOption(option, true);
    },
    initDrillingConditionBar() {
      const option = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        },
        xAxis: {
          type: "category",
          show: false,
          data: [""],
        },
        tooltip: {
          showDelay: 0,
          width: 100,
          transitionDuration: 0,
          formatter: (data) => {
            return `${data.marker} ${conditionBarMap[data.value]}`;
          },
        },
        yAxis: {
          type: "value",
          show: false,
          splitNumber: 200,
          inverse: true,
        },
        series: [
          ...this.conditionBarData.map((item, index) => ({
            type: "bar",
            stack: "Total",
            label: false,
            z: index,
            itemStyle: {
              borderColor: this.drillingConditionColorMap[item],
            },
            color: this.drillingConditionColorMap[item],
            data: [item],
            animationDuration: 0,
          })),
        ],
      };

      const drillingConditionChartElement = document.getElementsByClassName(
        "drillingConditionChart"
      )[0];

      const drillingConditionChart = echarts.init(
        drillingConditionChartElement
      );
      drillingConditionChart.setOption(option, true);
    },
    getUnconfirmedLog() {
      // 先清除现有的数据, 关闭掉所有目前已有的风险弹窗
      Object.keys(this.errorMap).forEach((errorKey) => {
        this.errorMap[errorKey].closeFn();
      });
      this.errorMap = {};

      // 然后进行接口查询，取得最新的值
      getUnconfirmedLogList({
        well: this.wellId,
      }).then((res) => {
        const { data, success } = res;
        if (success == true) {
          data.forEach((item) => {
            Object.assign(this.errorMap, {
              [item.type]: {
                id: item.id,
                type: item.type,
                wellDepth: item.wellDepth,
                date: item.time,
              },
            });
          });

          Object.keys(this.errorMap).forEach((item) => {
            const closeFn = this.createMessage({
              id: this.errorMap[item].id,
              type: this.errorMap[item].type,
              wellDepth: this.errorMap[item].wellDepth,
              date: this.errorMap[item].date,
            });
            Object.assign(this.errorMap[item], { closeFn: closeFn });
          });
        }
      });
    },
    setDisplayList(list, type) {
      switch (type) {
        case "riskChart-1":
          this.displayList1 = list;
          break;
        case "riskChart-2":
          this.displayList2 = list;
          break;
        case "riskChart-3":
          this.displayList3 = list;
          break;
        case "riskChart-4":
          this.displayList4 = list;
          break;
        case "riskChart-5":
          this.displayList5 = list;
          break;
        case "riskChart-6":
          this.displayList6 = list;
          break;
      }
    },
    modelUpdateClick() {},
    async getLatestData() {
      const { data, success } = await getRiskCurrentData({
        well: this.wellId,
        // wellDepth: this.currentDepth,
        time: this.currentTime,
      });

      if (success !== true) return;

      this.currentDepth = data.wellDepth;
      this.currentTime = data.time;

      this.kickValue = data.kick;
      this.labelLostValue = data.labelLostRisk;
      this.stuckValue = data.stuckValue;
      if (
        data.warningLogDTO &&
        data.warningLogDTO.type &&
        data.warningLogDTO.id
      ) {
        if (!this.errorMap[data.warningLogDTO.type]) {
          const closeFn = this.createMessage({
            id: data.warningLogDTO.id,
            type: data.warningLogDTO.type,
            wellDepth: data.warningLogDTO.wellDepth,
            date: data.warningLogDTO.time,
          });

          this.errorMap = {
            ...this.errorMap,
            [data.warningLogDTO.type]: {
              closeFn: closeFn,
            },
          };
        } else {
          this.errorMap[data.warningLogDTO.type].closeFn();

          Object.assign(this.errorMap, {
            [data.warningLogDTO.type]: {
              id: data.warningLogDTO.id,
              type: data.warningLogDTO.type,
              wellDepth: data.warningLogDTO.wellDepth,
              date: data.warningLogDTO.time,
            },
          });
          const closeFn = this.createMessage({
            id: data.warningLogDTO.id,
            type: data.warningLogDTO.type,
            wellDepth: data.warningLogDTO.wellDepth,
            date: data.warningLogDTO.time,
          });
          this.errorMap = {
            ...this.errorMap,
            [data.warningLogDTO.type]: {
              closeFn: closeFn,
            },
          };
        }
      }

      this.setLatestData(data);

      const setNewDisplayData = (displayList) => {
        displayList.forEach((item) => {
          // 判断是否设置过最大最小值
          if (item.isSetMinMax) return;

          // 判断字段是否存在于接口返回值中,不存在直接跳过
          const newValue = data[item.field];
          if (newValue === undefined) return;
          // 判断到存在值，接下来将会统一将接口新获取的current最新值，插入到displayList当中去
          item.chartData = [...item.chartData, newValue];

          // 同时还会更新最大最小值（可能插入的值会是最大或最小的值）
          item.max = max(item.chartData);
          item.min = min(item.chartData);
        });
      };
      setNewDisplayData(this.displayList1);
      setNewDisplayData(this.displayList2);
      setNewDisplayData(this.displayList3);
      setNewDisplayData(this.displayList4);
      setNewDisplayData(this.displayList5);
      setNewDisplayData(this.displayList6);

      const wellDepthDataClone = cloneDeep(this.wellDepthData);
      Object.assign(wellDepthDataClone, {
        [data.wellDepth]: {
          DATE: `${this.dayjs(data.time).format("HH:mm")} ${data.wellDepth}m`,
        },
      });
      this.wellDepthData = wellDepthDataClone;

      this.modalUpdateOriginData.push(data);
      
      this.bitDepthList.push(data.bitDepth);
      this.depthList.push(data.wellDepth);

      this.conditionBarData.push(data.formationType);
      this.horizonName.push({ name: data.horizonName, depth: data.wellDepth });
      // this.createBar();
      this.initDrillingConditionBar();
    },
    setLatestData(item) {
      // 工程参数
      this.state.dataList[0].num = item.wellDepth;
      this.state.dataList[1].num = item.bitDepth;
      this.state.dataList[2].num = item.rotateSpeed;
      this.state.dataList[3].num = item.who;
      this.state.dataList[4].num = item.wob;
      this.state.dataList[5].num = item.rotaryTorque;
      this.state.dataList[6].num = item.standpipePressure;
      this.state.dataList[7].num = item.rop;
      this.state.dataList[8].num = item.spm;
      this.state.dataList[9].num = item.totalPoolVol;
      // 特殊处理，后端的接口返回值有问题，所以要除以1000 2024/07/04移除了该逻辑，因为值已经能够正常返回 
      // this.state.dataList[10].num = floor(item.flowIn / 1000, 2);
      this.state.dataList[10].num = item.flowIn;
      this.state.dataList[11].num = item.flowOut;

      // 钻井液性能参数
      this.state.dataList2[0].num = item.mci;
      this.state.dataList2[1].num = item.mco;
      this.state.dataList2[2].num = item.mudTempIn;
      this.state.dataList2[3].num = item.mudTempOut;

      this.kickValue = item.kick;
      this.labelLostValue = item.labelLostRisk;
      // this.stuckValue = item.stuck;
    },
    async init() {
      this.getUnconfirmedLog();
      const riskData = await getRiskData({
        well: this.wellId,
      });

      if (riskData.success !== true) {
        console.warn("getRiskData error");
        return;
      }

      this.modalUpdateOriginData = riskData.data;
      this.csvData = riskData.data;


      // 钻头深度定制展示
      const bitDepthList = []

      // chart1
      const who = []; //大钩负荷
      const wob = []; //钻压
      const rotaryTorque = []; //扭矩
      const rotateSpeed = []; //转速

      // chart2
      const standpipePressure = []; //立管压力
      const casingPressure = []; //套管压力
      const spm = []; //累积泵冲
      const totalPoolVol = []; //总池体积

      // chart3
      const mudDensIn = []  //入口密度
      const mudDensOut = [] //出口密度
      const flowIn = []; //入口流量
      const flowOut = []; //出口流量
      const mci = []; //入口导电
      const mco = []; //出口导电

      // chart4
      const gas = [];

      // chart5
      const bhpPre = [];
      const flowDifferential = [];
      const kick = [];
      const labelLostRisk = [];

      // chart6
      // 摩阻系数
      const ff = [];
      // 卡钻概率
      const stuck = [];

      const depthList = [];
      const wellDepthData = {};
      const conditionBarData = [];
      const horizonName = [];

      riskData.data.forEach((item, index) => {
        bitDepthList.push(item.bitDepth)
        depthList.push(item.wellDepth);

        // chart1
        who.push(item.who);
        wob.push(item.wob);
        rotaryTorque.push(item.rotaryTorque);
        rotateSpeed.push(item.rotateSpeed);
        // chart2
        standpipePressure.push(item.standpipePressure);
        casingPressure.push(item.casingPressure);
        spm.push(item.spm);
        totalPoolVol.push(item.totalPoolVol);
        // chart3
        mudDensIn.push(item.mudDensIn)
        mudDensOut.push(item.mudDensOut)
        flowIn.push(item.flowIn);
        flowOut.push(item.flowOut);
        mci.push(item.mci);
        mco.push(item.mco);
        // chart4
        gas.push(item.gas);
        //chart5
        bhpPre.push(item.bhpPre);
        flowDifferential.push(item.flowDifferential);
        kick.push(item.kick);
        labelLostRisk.push(item.labelLostRisk);

        // chart6
        ff.push(floor(item.ff, 2));
        stuck.push(item.stuck);

        // conditionBar
        conditionBarData.push(item.formationType);

        //horizonNameList
        horizonName.push({ name: item.horizonName, depth: item.wellDepth });

        Object.assign(wellDepthData, {
          [item.wellDepth]: {
            DATE: `${this.dayjs(item.time).format("HH:mm")} ${item.wellDepth}m`,
          },
        });

        // 刷新画面或接口有值，最后一条默认为最新的一条，并将其显示到表盘上
        if (riskData.data.length - 1 == index) {
          this.setLatestData(item);
        }
      });

      this.currentDepth = max(depthList);
      const displayList1 = [
        {
          field: "who",
          name: "大钩负荷",
          color: colorList[1],
          unit: "tone",
          chartData: who,
          min: min(who),
          max: max(who),
        },
        {
          field: "wob",
          name: "钻压",
          color: colorList[2],
          unit: "tone",
          chartData: wob,
          min: min(wob),
          max: max(wob),
        },
        {
          field: "rotaryTorque",
          name: "扭矩",
          color: colorList[3],
          unit: "kn.m",
          chartData: rotaryTorque,
          min: min(rotaryTorque),
          max: max(rotaryTorque),
        },
        {
          field: "rotateSpeed",
          name: "转速",
          color: colorList[4],
          unit: "rpm",
          chartData: rotateSpeed,
          min: min(rotateSpeed),
          max: max(rotateSpeed),
        },
      ];
      const displayList2 = [
        {
          field: "standpipePressure",
          name: "立管压力",
          color: colorList[0],
          unit: "MPa",
          chartData: standpipePressure,
          min: min(standpipePressure),
          max: max(standpipePressure),
        },
        {
          field: "casingPressure",
          name: "套管压力",
          color: colorList[1],
          unit: "MPa",
          chartData: casingPressure,
          min: min(casingPressure),
          max: max(casingPressure),
        },
        {
          field: "spm",
          name: "累积泵冲",
          color: colorList[2],
          unit: "spm",
          chartData: spm,
          min: min(spm),
          max: max(spm),
        },
        {
          field: "totalPoolVol",
          name: "总池体积",
          color: colorList[3],
          unit: "m³",
          chartData: totalPoolVol,
          min: min(totalPoolVol),
          max: max(totalPoolVol),
        },
      ];
      const displayList3 = [
      {
          field: "mudDensIn",
          name: "入口密度",
          color: colorList[0],
          unit: "g/cm³",
          chartData: mudDensIn,
          min: min(mudDensIn),
          max: max(mudDensIn),
        },
        {
          field: "mudDensOut",
          name: "出口密度",
          color: colorList[1],
          unit: "g/cm³",
          chartData: mudDensOut,
          min: min(mudDensOut),
          max: max(mudDensOut),
        },
        {
          field: "flowIn",
          name: "入口流量",
          color: colorList[2],
          unit: "L/min",
          chartData: flowIn,
          min: min(flowIn),
          max: max(flowIn),
        },
        {
          field: "flowOut",
          name: "出口流量",
          color: colorList[3],
          unit: "L/min",
          chartData: flowOut,
          min: min(flowOut),
          max: max(flowOut),
        },
      ];
      const displayList4 = [
        {
          field: "gas",
          name: "全烃",
          color: colorList[0],
          unit: "GAS",
          chartData: gas,
          min: min(gas),
          max: max(gas),
        },
        {
          field: "mci",
          name: "入口电导",
          color: colorList[4],
          unit: "spm",
          chartData: mci,
          min: min(mci),
          max: max(mci),
        },
        {
          field: "mco",
          name: "出口电导",
          color: colorList[5],
          unit: "spm",
          chartData: mco,
          min: min(mco),
          max: max(mco),
        },
      ];

      const displayList5 = [
        {
          field: "bhpPre",
          name: "井底压力",
          color: colorList[1],
          unit: "MPa",
          chartData: bhpPre,
          min: min(bhpPre),
          max: max(bhpPre),
        },
        {
          field: "flowDifferential",
          name: "流量差",
          color: colorList[2],
          unit: "",
          chartData: flowDifferential,
          min: min(flowDifferential),
          max: max(flowDifferential),
        },
        {
          field: "kick",
          name: "溢流概率",
          color: colorList[3],
          unit: "%",
          chartData: kick,
          min: min(kick),
          max: max(kick),
        },
        {
          field: "labelLostRisk",
          name: "井漏概率",
          color: colorList[4],
          unit: "%",
          chartData: labelLostRisk,
          min: min(labelLostRisk),
          max: max(labelLostRisk),
        },
      ];

      const displayList6 = [
        {
          field: "stuck",
          name: "摩阻系数",
          color: colorList[0],
          chartData: ff,
          unit: "",
          min: min(stuck),
          max: max(stuck),
        },
        {
          field: "stuck",
          name: "卡钻概率",
          color: colorList[1],
          unit: "%",
          chartData: stuck,
          min: min(stuck),
          max: max(stuck),
        },
      ];

      this.wellDepthData = wellDepthData;

      this.depthList = depthList;
      this.bitDepthList = bitDepthList

      this.displayList1 = displayList1;
      this.displayList2 = displayList2;
      this.displayList3 = displayList3;
      this.displayList4 = displayList4;
      this.displayList5 = displayList5;
      this.displayList6 = displayList6;

      this.conditionBarData = conditionBarData;
      this.horizonName = horizonName;

      // this.createBar();
      this.initDrillingConditionBar();

      this.currentTime = riskData.data.length ? riskData.data[riskData.data.length - 1].time : this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS");
      this.getLatestData();

      this.timer = setInterval(async () => {
        this.currentTime = riskData.data.length ? riskData.data[riskData.data.length - 1].time : this.dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS");
        this.getLatestData();
        this.handleGetStuck()
      }, 5000);
      
      this.handleGetStuck()

      // const getLatestFn = () => {
      //   this.timer = setTimeout(async () => {
      //     if (this.isLoadingApi) {
      //       try {
      //         await this.getLatestData();
      //       } finally {
      //         getLatestFn();
      //       }
      //     }
      //   }, 5000);
      // };

      // getLatestFn();
    },
    async handleGetStuck () {
      const res = await getStuck({well: this.wellId,});
      this.stuckValue = res.data.stuck || 0
    }
  },
};
</script>
<style lang="less" scoped>
.ant-slider-vertical .ant-slider-mark-text {
  white-space: nowrap !important;
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid {
  display: grid !important;
}

.main {
  display: flex;
}

.charLineTwo,
.charLineOne {
  // position: absolute;
  min-width: 70px;
}

// .charLineTwo {
//   left: 130px;
// }

::v-deep .right-title .paramsTitle title .title-text {
  color: #ffffff !important;
}

.table-list {
  &:first-child {
    margin-top: 10px;
  }

  display: flex;
  justify-content: start;
  align-items: start;
}

.warning-content {
  font-size: 18px;
}

.warning-time {
  font-size: 20px;
  font-weight: 650;
  margin-right: 20px;

  &:last-child {
    margin-right: 0px;
    margin-left: 20px;
  }
}

.el-icon.icon {
  position: absolute;
  right: 60px;
  top: 10px;
  font-size: 18px;
  color: rgb(127, 127, 127);
  font-weight: 700;
  cursor: pointer;
}

::v-deep .el-tag {
  color: #3483e0;
  font-size: 16px;
  background: rgba(52, 131, 224, 0.1);
  border-radius: 5px;
  border: none;
  height: 36px;
  line-height: 36px;
}

.el-tag--medium {
  height: 36px;
  line-height: 36px;
}

.tabs-title {
  width: 307px;
  height: 45px;
  background: rgba(51, 51, 51, 0.1);
  border-radius: 5px;
  display: flex;
  line-height: 45px;
  justify-content: center;

  .tabs-time,
  .tabs-deepWell {
    width: 50%;
    color: #ffffff;
    background: transparent;
    border-radius: 5px;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
  }

  .active {
    width: 133px;
    color: #fff;
    background: #3483e0;
    border-radius: 5px;
    height: 35px;
    line-height: 35px;
    margin-top: 5px;
  }
}

::v-deep .el-range-editor .el-range-input {
  background-color: transparent;
}

::v-deep .el-input-number.is-without-controls .el-input__inner {
  padding: 0;
  background-color: rgba(51, 51, 51, 0.1);
}

::v-deep .el-select .el-input.is-disabled .el-input__inner {
  background-color: rgba(52, 131, 224, 0.1);
  color: rgba(52, 131, 224, 1);
  font-size: 16px;
}

.moudle_change,
.change_stick {
  ::v-deep .el-input-number.is-without-controls .el-input__inner {
    padding: 0;
    background-color: rgba(235, 240, 245, 1);
  }

  ::v-deep .el-select .el-input__inner {
    background-color: rgba(235, 240, 245, 1);
  }
}

::v-deep .el-cascader .el-input .el-input__inner {
  background-color: rgba(235, 240, 245, 1);
}

::v-deep .el-form-item__label {
  font-size: 16px;
}

.chartLegend {
  height: 60px;
  width: 90%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: flex-start;
  border-left: 1px solid rgba(51, 51, 51, 0.3);

  .item {
    display: flex;

    .item-icon {
      width: 10px;
      height: 10px;
    }

    .item-txt {
      color: #ffffff;
      line-height: 10px;
      margin-left: 5px;
    }
  }
}

.chartLegendTwo {
  flex-direction: unset;

  .legendFlex {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;

    .item {
      .item-txt {
        margin-left: 2px;
      }
    }
  }
}

.charBarSeven {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
  padding: 0;

  .markLine {
    color: #ffffff;
    height: 24%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;

    .time {
      margin: 0;
      text-align: center;
    }

    .deepWell {
      width: 100%;
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

<style lang="less">
.main-left {
  min-width: 300px;
  width: 15%;
  overflow: auto;
  background: #093a6f;
  margin-left: 10px;

  .data-box {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .data-item {
    height: 100%;
    min-width: 127px;
    background: #07284e;
    border: 1px solid #5db0fc;

    .item-top {
      color: #ffffff;
    }

    .item-num {
      text-align: center;
    }

    .item-top {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      line-height: 24px;
    }

    .item-num {
      color: #00cbaf;
      font-weight: 650;
      font-size: 26px;
      word-wrap: break-word;
    }
  }
}

.main-right {
  margin-left: 10px;
  flex: 1;
  background: #093a6f;

  .chartLeft {
    overflow-x: auto;
    position: relative;
    display: flex;
    min-width: 1380px;
    width: 100%;

    .charBarSeven {
      width: 100%;
      padding: 0;
    }
  }
}
.ant-message-custom-content {
  display: flex !important;
}

.ant-message-notice {
  text-align: right !important;
  width: 75%;
  min-width: 1200px;
}

.ant-message {
  margin-top: 48px !important;
}

.riskInfo {
  .ant-slider-track,
  .ant-slider-rail,
  .ant-slider-step,
  .ant-slider-handle {
    display: none;
  }

  .ant-slider-mark {
    left: -24px !important;
  }

  .sliderHeight {
    height: calc(100% - 3rem) !important;
    padding-top: 7rem !important;
  }
}

.riskModal {
  .ant-modal-footer {
    display: none;
  }

  .ant-modal-body {
    min-height: 300px;
    height: 100%;
  }
}

.ant-message {
  z-index: 1 !important;
}

.right-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background: #000c37d9;

  .title-logo {
    height: 26px;
    background: rgba(63, 133, 237, 1);
    width: 4px;
    display: inline-block;
    vertical-align: middle;
  }

  .title-text {
    font-size: 24px;
    line-height: 26px;
    // font-weight: 650;
    margin-left: 10px;
    vertical-align: middle;
    color: #ffffff;
  }
}
</style>
