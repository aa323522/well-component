<template>
  <div>
    <div
      class="btn btn-default detail pointer"
      @click="
        () => {
          exportBtnClick();
        }
      "
    >
      {{ title }}
    </div>
    <a-modal
      title="导出CSV"
      v-model="visible"
      @ok="handleExportCsv"
      okText="导出"
      cancelText="取消"
      :afterClose="
        () => {
          exportType = 'all';
        }
      "
    >
      <div class="flex flex-column gap-y-4">
        <div>
          <a-radio-group
            class="radioButton"
            v-model="exportType"
            @change="onChange"
          >
            <a-radio value="all">
              全部
            </a-radio>
            <a-radio value="range">
              指定时间
            </a-radio>
            <a-radio value="depth">
              深度
            </a-radio>
          </a-radio-group>
        </div>
        <div v-if="exportType === 'range'">
          <a-range-picker
            :locale="locale"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['起始时间', '结束时间']"
            v-model="selectTime"
          >
          </a-range-picker>
        </div>
        <div v-if="exportType === 'depth'">
          <div class="flex gap-x-2 align-center">
            <a-input-number v-model="startDepth" />
            ~
            <a-input-number v-model="endDepth" />
            m
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { min, max } from "lodash";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import DownloadExcel from "vue-json-excel";

export default {
  name: "ExportCsvButton",
  props: {
    title: {
      type: String,
      default: "导出CSV文件"
    },
    columns: {
      type: Array,
      default: () => []
    },
    csvData: {
      type: Array,
      default: () => []
    },
    createCsvData: {
      type: Function
    },
    exportForTime: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  components: {
    DownloadExcel
  },
  data() {
    return {
      locale,
      selectTime: undefined,
      visible: false,
      exportType: "all",
      startDepth: undefined,
      endDepth: undefined
      // csvData: [
      //   {time: 'xxx'}
      // ],
      // columns: [
      //   { title: "时间", key: "time" },
      //   { title: "砂堵风险", key: "pre_RESULT" },
      //   { title: "施工时间(s)", key: "serial_NUMBER" },
      //   { title: "砂量(m³)", key: "pumping_SAND_VOLUME" },
      //   { title: "排量(m³/min)", key: "total_PUMP_DISPL" },
      //   {
      //     title: "液量(m³)",
      //     key: "pumping_FLUID_VOLUME_TOTAL"
      //   },
      //   {
      //     title: "砂浓度(kg/m³)",
      //     key: "pumping_LIQUID_CONCENTRATION"
      //   },
      //   { title: "泵压(MPa)", key: "total_PUMP_PRESSURE" }
      // ]
    };
  },
  methods: {
    // radioButton change
    onChange(e) {
      this.resetDateInputDefaultValue();
      this.resetDepthInputDefaultValue();
    },

    resetDateInputDefaultValue() {
      const exportData = this.createCsvData
        ? this.createCsvData(this.csvData)
        : this.csvData;
      // selectTime
      // 至少有2条以上的时间点，输入默认值
      if (exportData.length >= 2) {
        this.selectTime = [
          this.dayjs(exportData[0].time).format("YYYY-MM-DD HH:mm:ss"),
          this.dayjs(exportData[exportData.length - 1].time).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        ];
      }
    },
    resetDepthInputDefaultValue() {
      const exportData = this.createCsvData
        ? this.createCsvData(this.csvData)
        : this.csvData;
      // selectTime
      // 至少有2条以上的深度，输入默认值
      if (exportData.length >= 2) {
        const originData = exportData.map(item => item.wellDepth);

        this.startDepth = min(originData);
        this.endDepth = max(originData);
      }
    },
    handleChangeNav(index) {
      this.$emit("changeActiveIndex", index);
    },

    exportCsv(columns, dataList, fileName) {
      let title = columns.map(item => item.title);
      let keyArray = columns.map(item => item.key);
      let str = [];
      str.push(title.join(",") + "\n");
      for (let i = 0; i < dataList.length; i++) {
        const temp = [];
        for (let j = 0; j < keyArray.length; j++) {
          temp.push(dataList[i][keyArray[j]]);
        }
        str.push(temp.join(",") + "\n");
      }
      let uri =
        "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str.join(""));

      let downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    exportBtnClick() {
      const exportData = this.createCsvData
        ? this.createCsvData(this.csvData)
        : this.csvData;

      if (this.exportForTime) {
        this.visible = true;
        this.resetDateInputDefaultValue();
      } else {
        this.exportCsv(
          this.columns,
          exportData,
          `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} CSV导出.csv`
        );
      }
    },
    handleExportCsv() {
      const exportData = this.createCsvData
        ? this.createCsvData(this.csvData)
        : this.csvData;

      if (this.exportType === "all") {
        this.exportCsv(
          this.columns,
          exportData,
          `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} CSV导出.csv`
        );
      } else if (this.exportType === "range") {
        if (!this.selectTime) return;
        const startTime = this.dayjs(this.selectTime[0]);
        const endTime = this.dayjs(this.selectTime[1]);

        const filterData = exportData.filter(item => {
          //  startTime <= time <= endTime 过滤区间
          return (
            (this.dayjs(item.time).isBefore(endTime) ||
              this.dayjs(item.time).isSame(endTime)) &&
            (this.dayjs(item.time).isAfter(startTime) ||
              this.dayjs(item.time).isSame(startTime))
          );
        });

        this.exportCsv(
          this.columns,
          filterData,
          `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} CSV导出.csv`
        );
      } else if (this.exportType === "depth") {
        const filterData = exportData.filter(item => {
          return (
            item.wellDepth >= this.startDepth && item.wellDepth <= this.endDepth
          );
        });

        this.exportCsv(
          this.columns,
          filterData,
          `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} CSV导出.csv`
        );
      }

      this.visible = false;
    }
  }
};
</script>

<style lang="less">
.detail {
  font-size: 16px !important;
  height: 40px;
  line-height: 40px;
  background: url("../../assets/active-title.png") no-repeat;
  background-size: 133px 40px;
  background-position: center center;
}

.radioButton {
  .ant-radio-wrapper {
    color: white;
  }
}
</style>
