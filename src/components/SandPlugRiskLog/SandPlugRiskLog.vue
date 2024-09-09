<template>
  <div class="riskLog h-full">
    <div class="h-full">
      <div ref="seamlessRef" class="h-full">
        <el-table :data="SandPlugLogData" style="width: 100%" @row-click="handleRowClick" :cell-class-name="setCellClass"
          height="100%">
          <el-table-column prop="time" label="时间" :width="isShowAllLog ? '220' : '120'" align="center">
            <template slot-scope="scope">
              <span style="color: #bbbbbb">--</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" :width="isShowAllLog ? '220' : '60'" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type">
                <span v-if="scope.row.type == 1" class="yl">砂堵</span>
                <span v-else>其他</span>
              </span>
              <span style="color: #bbbbbb" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" :width="isShowAllLog ? '220' : '100'" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status !== ''">
                <span v-if="scope.row.status == -1">未确认</span>
                <span v-if="scope.row.status == 1" class="accurate">准确</span>
                <span v-if="scope.row.status == 2" class="wrong">误报</span>
              </span>
              <span style="color: #bbbbbb" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="持续时间" :width="isShowAllLog ? '220' : '100'" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.count !== ''">
                {{ scope.row.count }}秒
              </span>
              <span style="color: #bbbbbb" v-else>--</span>
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="备注" align="left">
            <template slot-scope="scope">
              <el-tooltip v-tooltipautoshow effect="dark" :open-delay="500" :content="scope.row.remark" placement="top"
                v-if="scope.row.remark">
                <div class="oneline">{{ scope.row.remark }}</div>
              </el-tooltip>
              <span style="color: #bbbbbb" v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="操作" align="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="备注" placement="top">
                <a-icon type="edit" class="pointer w-8 h-8" @click="(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  editMemo(scope.row)
                }
                  " />
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-popconfirm title="确定删除该内容吗？" @confirm="onDelete(scope.row)">
                  <a-icon type="delete" class="pointer w-8 h-8" slot="reference" />
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="备注信息" :visible.sync="dialogVisible" @close="onClose" width="30%" :modal="false">
      <el-input v-model="remarkValue" placeholder="请输入备注信息" maxlength="50" type="textarea" show-word-limit
        :autosize="{ minRows: 2, maxRows: 20 }" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editSpLogRemark, deleteSpLogRemark } from '../../api/SandPlugApi.js'
export default {
  name: 'RiskLog',
  props: {
    SandPlugLogData: {
      type: Array,
      default: () => [],
    },
    getWarningInfo: {
      type: Function,
      default: () => { },
    },
    isShowAllLog: {
      type: Boolean,
    },
  },
  data () {
    return {
      riskLogCopyData: [], //滚动数据
      vueSeamlessOptions: null,
      dialogVisible: false,
      remarkValue: '',
      remark: '',
      currentId: undefined,
      highLightId: undefined,
    }
  },
  methods: {
    onClickRemark () {
      this.$nextTick(() => {
        this.$refs.vueSeamlessRef._cancle()
      })
      this.dialogVisible = true
    },
    //删除报警日志
    async onDelete (value) {
      await deleteSpLogRemark({ id: value.id })
      this.getWarningInfo()
    },
    editMemo (e) {
      this.remarkValue = e.remark
      this.currentId = e.id
      this.dialogVisible = true
    },
    setCellClass (row) {
      if (this.highLightId === row.row.id) return 'highLight'
    },
    onClose () { },
    async handleSave () {
      this.dialogVisible = false
      await editSpLogRemark({
        id: this.currentId,
        remark: this.remarkValue,
      })
      this.getWarningInfo()
    },
    handleRowClick (e) {
      this.$emit('changeLimit', e.js)
    },
  },
}
</script>
<style lang="less">
@import '../../style/riskLog.less';
</style>
