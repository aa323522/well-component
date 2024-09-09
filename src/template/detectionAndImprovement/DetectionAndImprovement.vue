<template>
  <div class="detectionAndImprovement w-full h-full relative">
    <!-- <a-spin :spinning="loading" class="loadingBody" tip="程序启动中..." :delay="100"/> -->
    <div class="px-4 h-full pt-20 flex flex-column gap-y-2 pb-4">
      <div class="flex align-center justify-between">
        <div class="flex gap-x-2">
          <div
            @click="changeDisplayType('HEAT')"
            class="px-4 py-2 pointer"
            :style="`border-top: 0.125rem solid #12BDFF; background: ${
              type == 'HEAT'
                ? 'linear-gradient(rgb(13 76 95) 0%, rgb(9 87 167) 100%)'
                : 'linear-gradient(rgb(64 198 249) 0%, rgb(8 68 91) 100%)'
            }`"
          >
            优化热力图
          </div>
          <div
            @click="changeDisplayType('RECOMMEND')"
            class="px-4 py-2 pointer"
            :style="`border-top: 0.125rem solid #12BDFF; background: ${
              type == 'RECOMMEND'
                ? 'linear-gradient(rgb(13 76 95) 0%, rgb(9 87 167) 100%)'
                : 'linear-gradient(rgb(64 198 249) 0%, rgb(8 68 91) 100%)'
            }`"
          >
            钻参推荐图
          </div>
        </div>
        <div
          class="flex gap-x-2 align-center"
          :style="type != 'HEAT' ? 'margin-right: 80px' : undefined"
        >
            <!-- <a-select
              v-model="dataType"
              placeholder="未知类型"
              @change="handleDataTypeChange"
            >
              <a-select-option :value="1">
                本地数据
              </a-select-option>
              <a-select-option :value="2">
                网络数据
              </a-select-option>
              <a-select-option :value="3">
                导入数据
              </a-select-option>
            </a-select> -->
            <a-button
            v-if="type == 'RECOMMEND'"
            @click="
              () => {
                downloadTemplate();
              }
            "
          >
            <a-icon type="download" /> 下载数据模版
          </a-button>
          <a-upload
            action=""
            :fileList="[]"
            name="file"
            :multiple="false"
            :before-upload="beforeAllUpload"
          >
            <a-button> <a-icon type="upload" /> 优化全部 </a-button>
          </a-upload>
          <a-upload
            action=""
            :fileList="[]"
            name="file"
            :multiple="false"
            :before-upload="beforeUpload"
          >
            <a-button> <a-icon type="upload" /> 导入数据 </a-button>
          </a-upload>
          <a-button
            @click="
              () => {
                handleClear();
              }
            "
            type="danger"
            v-if="type != 'HEAT'"
          >
            重置数据
          </a-button>
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item v-for="item in wellList" :key="item">
                {{ item }}
              </a-menu-item>
            </a-menu>
            <div
              class="px-4 py-2"
              style="
                border-top: 0.125rem solid #12bdff;
                background: linear-gradient(180deg, #080f26 0%, #0c1b4f 100%);
              "
            >
              {{ wellName }}
            </div>
          </a-dropdown>
          <a-dropdown>
            <a-menu slot="overlay" @click="handleLevelMenuClick">
              <a-menu-item v-for="item in levelList" :key="item">
                {{ item }}
              </a-menu-item>
            </a-menu>
            <div
              class="px-4 py-2"
              style="
                border-top: 0.125rem solid #12bdff;
                background: linear-gradient(180deg, #080f26 0%, #0c1b4f 100%);
              "
            >
              {{ horizonName }}层
            </div>
          </a-dropdown>
          <ExportCsvButton
            id="csvExport"
            v-if="type == 'RECOMMEND'"
            exportForTime
            :columns="detectionAndImprovementColumn"
            :csvData="csvData"
            :createCsvData="createCsvData"
          />
        </div>
      </div>
      <div class="displayDiv">
        <OptimizeHeat
          v-if="type == 'HEAT'"
          :horizonName="horizonName"
          :wellName="wellName"
          :setWellName="setWellName"
          :setLoading="setLoading"
        />
        <RecommendedParameters
          v-if="type == 'RECOMMEND'"
          :levelList="depthList"
          :wellName="wellName"
          :horizonName="horizonName"
          :setCsvData="setCsvData"
          :setLoading="setLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import { detectionAndImprovementColumn } from "../../utils/csvExportColumn.js";
import { Message } from "element-ui";
import {
  getWellList,
  getHorizonNameList,
  deleteData,
  importExcel,
  initDataType,
  getDataType,
  downloadAll,
  importAll
} from "../../api/detectionAndImprovementApi.js";
import RecommendedParameters from "../../components/RecommendedParameters/RecommendedParameters.vue";
import OptimizeHeat from "../../template/optimizeHeat/OptimizeHeat.vue";
import ExportCsvButton from "../../components/ExportCsvButton/ExportCsvButton.vue";
export default {
  name: "DetectionAndImprovement",
  components: {
    RecommendedParameters,
    OptimizeHeat,
    ExportCsvButton,
  },
  data() {
    return {
      loading: true,
      detectionAndImprovementColumn,
      type: "HEAT",
      wellList: [],
      wellName: "",
      horizonName: "",
      levelList: [],
      depthList: ["50m", "100m", "150m", "300m"],
      csvData: [],
      dataType: '未知类型',
    };
  },

  mounted() {
    this.init();

    // 离线版
    const getLatestFn = () => {
      this.timer = setTimeout(async () => {
        if (!this.wellName || !this.horizonName) { 
          await this.init();
          getLatestFn();
        } else {
          clearTimeout(this.timer);
        }
      }, 5000);
    };
    getLatestFn();
  },
  methods: {
    downloadTemplate() {
      const link = document.createElement("a");
      link.href = "/rop_template.xlsx";
      link.download = "数据模版.xlsx";

      link.click();
    },
    async beforeUpload(file) {
      const formData = new FormData();
      formData.append("file", file);
      const { success, data } = await importExcel(formData);

      Message({
        message: data || "未知导入状态",
        type: success ? "success" : "error",
      });
      if (success) {
        this.type = "HEAT";
        this.init();
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return Promise.reject();
    },
    setLoading(v) {
      this.loading = v;
    },
    createCsvData(csvData) {
      return csvData.map((item) => {
        return {
          ...item,
          wearMonitoring: `${item.wearMonitoring * 12.5}%`,
        };
      });
    },
    setCsvData(newValue) {
      this.csvData = newValue;
    },
    async init() {
      this.loading = true;
      await Promise.all([this.handleGetWellName(), this.handleGetLevelList()]);
      // await Promise.all([this.handleGetWellName(), this.handleGetLevelList(), this.handleInitDataType()]);
    },
    async handleGetWellName() {
      const { success, data } = await getWellList();
      if (success != true) return;
      this.wellList = data;
      this.wellName = data[0];
    },
    async handleGetLevelList() {
      const { success, data } = await getHorizonNameList();
      if (success != true) return;
      this.levelList = data;
      this.horizonName = data[0];
    },
    handleMenuClick(e) {
      this.wellName = e.key;
    },
    handleLevelMenuClick(e) {
      this.horizonName = e.key;
    },
    changeDisplayType(type) {
      this.type = type;
      if (type === "RECOMMEND") {
        this.loading = true;
      }
    },
    setWellName(wellName) {
      this.wellName = wellName;
    },
    async handleClear() {
      await deleteData();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    async handleInitDataType() {
      const dataType = await getDataType();
      this.dataType = dataType.data.dataType

    },
    async handleDataTypeChange () {
      await initDataType({
        dataType: this.dataType
      })
      Message({
        message: "切换数据来源成功",
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },

    async beforeAllUpload(file) {
      const formData = new FormData();
      formData.append("file", file);
      Message({
        message: "正在导入数据",
        type: 'success',
      });
      const { success, data } = await importAll(formData);
      if (success) {
        Message({
          message: "优化数据导入成功，正在生成CSV",
          type: 'success',
        });

        setTimeout(() => {
          this.handleDownloadAll(data)
          this.type = "HEAT";
          this.init();    
        }, 1000);

        setTimeout(() => {
          window.location.reload();
        }, 3000);

      }


      return Promise.reject();
    },

    async handleDownloadAll (data) {
        this.exportCsv(
        this.detectionAndImprovementColumn,
        data,
        `${this.dayjs().format("YYYY-MM-DD HH:mm:ss")} 优化全部数据导出.csv`
      );
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
  },
};
</script>

<style lang="less">
@import "../../style/detectionAndImprovement.less";

.loadingBody {
  z-index: 1000;
  background: #00000073;
  position: absolute !important;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  .ant-spin-dot {
    font-size: 40px;
    width: 1em;
    height: 1em;
  }

  .ant-spin-dot-spin {
    top: 50%;
  }

  .ant-spin-text {
    font-size: 30px;
    color: aliceblue;
  }
}
.displayDiv {
  height: calc(100% - 48px);
}

.detail {
  height: 40px;
  line-height: 40px;
  background-size: 120px 40px;
  background: url(../../assets/active-title.png) no-repeat;
  background-position: center center;
  width: 120px;
  display: flex;
  justify-content: center;
}
</style>
