<template>
  <div class="riskLog h-full">
    <div class="h-full">
      <div ref="seamlessRef" class="h-full">
        <el-table
          class="riskLogTable"
          :data="riskLogData"
          style="width: 100%"
          @row-click="handleRowClick"
          :cell-class-name="setCellClass"
          height="100%"
        >
          <el-table-column
            prop="js"
            label="井深"
            :width="isShowLog ? '220' : '120'"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.js">{{ scope.row.js }}</span>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            :width="isShowLog ? '220' : '200'"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.time">{{ scope.row.time }}</span>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === 'riskWarning'"
            prop="state"
            label="异常状态"
            :width="isShowLog ? '220' : '120'"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state">
                <span v-if="scope.row.state == 1" class="yl">溢流</span>
                <span v-else-if="scope.row.state == 2" class="kz">卡钻</span>
                <span v-else-if="scope.row.state == 3" class="yl-kz"
                  >溢流&卡钻</span
                >
                <span v-else-if="scope.row.state">{{ scope.row.state }}</span>
                <span v-else>非钻进</span>
              </span>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="type === 'riskInfo'"
            prop="type"
            label="异常状态"
            :width="isShowLog ? '220' : '120'"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type">
                <!-- <span v-if="scope.row.type == '溢流'" class="yl">溢流</span>
                <span v-else-if="scope.row.type == '卡钻'" class="kz">卡钻</span>
                <span v-else-if="scope.row.type == '溢流&卡钻'" class="yl-kz"
                  >溢流&卡钻</span
                > -->
              <!-- <span :class="scope.row.type == '溢流' ? "yl" : scope.row.type == '卡钻' ? 'kz' : ''">
                {{scope.row.type}}
              </span> -->
              <span>{{scope.row.type}}</span>
              </span>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="opt"
            label="是否操作"
            :width="isShowLog ? '220' : '120'"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.opt !== ''">
                <span v-if="scope.row.opt == 0">未确认</span>
                <span v-if="scope.row.opt == 1" class="accurate">准确</span>
                <span v-if="scope.row.opt == 2" class="wrong">误报</span>
              </span>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="left">
            <template slot-scope="scope">
              <el-tooltip
                v-tooltipautoshow
                effect="dark"
                :open-delay="500"
                :content="scope.row.remark"
                placement="top"
                v-if="scope.row.remark"
              >
                <div class="oneline">{{ scope.row.remark }}</div>
              </el-tooltip>
              <span style="color: #BBBBBB;" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="操作" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="备注" placement="top">
                <a-icon
                  type="edit"
                  class="pointer w-8 h-8"
                  @click="
                    e => {
                      e.preventDefault();
                      e.stopPropagation();
                      editMemo(scope);
                    }
                  "
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-popconfirm
                  title="确定删除该内容吗？"
                  @confirm="onDelete(scope.row)"
                >
                  <a-icon
                    type="delete"
                    class="pointer w-8 h-8"
                    slot="reference"
                  />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="备注信息"
      :visible.sync="dialogVisible"
      @close="onClose"
      width="30%"
      :modal="false"
    >
      <el-input
        v-model="remarkValue"
        placeholder="请输入备注信息"
        maxlength="50"
        type="textarea"
        show-word-limit
        :autosize="{ minRows: 2, maxRows: 20 }"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editLogRemark, deleteLogRemark } from "../../api/riskWarningApi.js";
import { riskEditLogRemark, riskDeleteLogRemark } from "../..//api/riskInfoApi.js";

export default {
  name: "RiskLog",
  props: {
    type: {
      type: String
    },
    riskLogData: {
      type: Array,
      default: () => []
    },
    getWarningInfo: {
      type: Function,
      default: () => {}
    },
    isShowLog: {
      type: Boolean
    },
    showLog: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    isShowLog: {
      handler(value) {
        if (!value) this.highLightId = undefined;
      }
    }
  },
  data() {
    return {
      riskLogCopyData: [], //滚动数据
      vueSeamlessOptions: null,
      dialogVisible: false,
      remarkValue: "",
      remark: "",
      currentId: undefined,
      highLightId: undefined
    };
  },
  methods: {
    onClickRemark() {
      this.$nextTick(() => {
        this.$refs.vueSeamlessRef._cancle();
      });
      this.dialogVisible = true;
    },
    onClickEcharts(e) {
      this.highLightId = e.row.id;
      this.showLog(true);
    },
    //删除报警日志
    async onDelete(value) {
      await (this.type === "riskInfo" ? riskDeleteLogRemark : deleteLogRemark)({
        id: value.id
      });
      this.getWarningInfo();
    },
    editMemo(e) {
      this.remarkValue = e.remark;
      this.currentId = e.id;
      this.dialogVisible = true;
    },
    setCellClass(row) {
      if (this.highLightId === row.row.id) return "highLight";
    },
    onClose() {},
    async handleSave() {
      this.dialogVisible = false;
      await (this.type === "riskInfo" ? riskEditLogRemark : editLogRemark)({
        id: this.currentId,
        remark: this.remarkValue
      });
      this.getWarningInfo();
    },
    handleRowClick(e) {
      this.$emit("changeLimit", e.js);
    }
  }
};
</script>
<style lang="less">
@import "../../style/RiskLog.less";
</style>
