<template>
  <div class="flex flex-column modalUpdateButton">
    <a-button @click="modelUpdateClick" :loading="loading">模型更新</a-button>
    <a-modal
      wrapClassName="modalUpdateModal"
      v-model="visible"
      title="模型更新"
      @ok="handleDataSave"
      width="100%"
      cancelText="取消"
      okText="确认并生成模型"
      :okButtonProps="{ props: { disabled: !processedData.length } }"
      :afterClose="resetParams"
    >
      <div style="height: 600px" class="flex h-full w-full gap-x-2">
        <div
          style="width: 50px; background: #000c37d9"
          class="h-full flex flex-column"
        >
          <div
            style="height: 50%"
            class="flex justify-center text-lg align-center pointer"
          >
            <div
              :class="'p-4 h-full flex align-center menuActive'"
              style="color: white"
            >
              <span>溢流模型</span>
            </div>
          </div>
          <div
            style="height: 50%"
            class="flex justify-center text-lg align-center pointer"
          >
            <div :class="'p-4 h-full flex align-center'" style="color: white">
              井漏模型
            </div>
          </div>
          <div
            style="height: 50%"
            class="flex justify-center text-lg align-center pointer"
          >
            <div :class="'p-4 h-full flex align-center'" style="color: white">
              卡钻模型
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-1 gap-y-2">
          <div class="flex-1" style="minHeight: 300px">
            <div class="flex h-full gap-x-4">
              <div style="width: 40%" class="h-full flex flex-column gap-y-2">
                <div class="flex gap-x-2 align-center">
                  <el-select
                    placeholder="请选择子模型"
                    class="modalSelect w-full"
                    v-model="modalId"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="(item, index) in modalOptions"
                      :key="index"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  <div>
                    <a-button
                      size="large"
                      :loading="processLoading"
                      type="primary"
                      @click="dataProcessClick"
                      :disabled="!selectedWellId"
                      >处理数据</a-button
                    >
                  </div>
                </div>
                <el-table :data="tableData" style="width: 100%" class="flex-1">
                  <el-table-column prop="wellId" label="井名" width="180">
                    <template slot-scope="scope">
                      <el-radio
                        class="wellName"
                        v-model="selectedWellId"
                        :label="scope.row.id"
                        >{{ scope.row.wellId }}</el-radio
                      >
                    </template>
                  </el-table-column>
                  <el-table-column prop="wellDepth" label="深度" width="180">
                    <template slot-scope="scope">
                      <span>{{ scope.row.wellDepth }}m</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="风险类型">
                  </el-table-column>
                  <el-table-column prop="time" label="发生时间" width="200">
                  </el-table-column>
                </el-table>
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="1"
                  class="text-center"
                >
                </el-pagination>
              </div>
              <ModalChart
                v-if="processedData.length"
                style="width: 60%;height: 100%"
                :processedData="processedData"
                :modalUpdateOriginData="modalUpdateOriginData"
                :selectedDepth="selectedDepth"
                :depthList="depthList"
              />
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal title="保存最优模型" v-model="saveModalVisible" :footer="null">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="保存名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <a-progress
          :percent="percent"
          style="paddingLeft: 100px"
          class="my-2"
        />
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="submitForm('ruleForm')"
            :loading="saveModalLoading"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </a-modal>
  </div>
</template>
<script>
import {
  getAlgorithmList,
  getWarningLogList,
  getDataProcess,
  algorithmUpdate
} from "../../api/riskInfoApi.js";
import ModalChart from "../ModalChart/ModalChart.vue";

export default {
  name: "riskInfo",
  props: {
    wellName: {
      type: String
    },
    modalUpdateOriginData: {
      type: Array,
      default: []
    },
    depthList: {
      type: Array,
      default: []
    }
  },
  components: { ModalChart },
  computed: {},
  data() {
    return {
      modalId: undefined,
      displayList: [
        {
          max: 50,
          min: 12,
          name: "钻压",
          color: "#4c25dd",
          unit: "tone",
          chartData: [12, 25, 30, 22, 15, 35, 14]
        }
      ],

      loading: false,
      visible: false,
      saveModalVisible: false,
      tableData: [],
      modalOptions: [],
      ruleForm: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入模型名称", trigger: "blur" }]
      },
      selectedWellId: undefined,
      selectedDepth: undefined,
      processedData: [],
      saveModalLoading: false,
      processLoading: false,
      percent: 0
    };
  },
  methods: {
    async handleGetAlgorithmList() {
      const { data, success } = await getAlgorithmList();
      if (success) return data;
    },
    async handleGetWarningLogList() {
      const { data, success } = await getWarningLogList({
        well: this.wellName
      });
      if (success) return data;
    },
    async handleGetDataProcess(params) {
      const { data, success } = await getDataProcess(params);
      if (success) return data;

      return [];
    },
    async modelUpdateClick() {
      this.loading = true;

      try {
        const res = await Promise.all([
          this.handleGetAlgorithmList(),
          this.handleGetWarningLogList()
        ]);

        this.modalOptions = res[0];
        this.tableData = res[1];

        this.visible = true;
      } finally {
        this.loading = false;
      }
    },
    async dataProcessClick() {
      if (!this.selectedWellId) {
        return;
      }

      const foundIndex = this.tableData.findIndex(item => {
        return item.id === this.selectedWellId;
      });
      if (foundIndex === -1) return;

      const well = this.tableData[foundIndex].wellId;
      const wellDepth = this.tableData[foundIndex].wellDepth;
      this.selectedDepth = wellDepth;

      this.processLoading = true;

      try {
        this.processedData = await this.handleGetDataProcess({
          well,
          wellDepth
        });
      } finally {
        this.processLoading = false;
      }
    },
    handleDataSave() {
      this.saveModalVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.saveModalLoading = true;

          const timer = setInterval(() => {
            const data = parseInt(Math.random() * 10);

            if (this.percent + data >= 100) {
              clearInterval(timer);
              return;
            }
            this.percent += data;
          }, 1000);
          await algorithmUpdate({
            name: this.ruleForm.name
          });
          this.percent = 100;

          const timer2 = setTimeout(() => {
            this.saveModalLoading = false;
            this.visible = false;
            this.saveModalVisible = false;
            this.resetParams();
            this.$message.success("保存成功");

            clearTimeout(timer2);
          }, 1000);
        }
      });
    },
    resetParams() {
      this.tableData = [];
      this.modalOptions = [];
      this.ruleForm = { name: "" };
      this.selectedWellId = undefined;
      this.processedData = [];
      this.modalId = undefined;
      this.percent = 0;
    }
  }
};
</script>

<style lang="less">
@import "../../style/ModalUpdateButton.less";

.menuActive {
  background: #15c7e885;
}

.modalSelect {
}

.modalUpdateModal {
  .wellName {
    .el-radio__label {
      color: white;
    }
  }
}
</style>
