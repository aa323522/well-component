<template>
  <div class="pressureRelationshipChart relative h-full">
    <div>
      <div class="!absolute z-10 right-0">
        <div class="flex">
          <div class="absolute z-10 flex gap-x-2" style="top: 20px; right: 20px">
            <a-dropdown trigger="click">
              <a-menu slot="overlay" @click="handleMenuClick" overlayClassName="pressureRelationshipChartMenu">
                <el-table :data="tableData" style="width: 100%" border>
                  <el-table-column prop="name" label="坐标轴名称" width="180px">
                  </el-table-column>
                  <el-table-column label="Y轴起始值" width="180px">
                    <template slot-scope="scope">
                      <a-input-number class="w-full" v-model="scope.row.minRangeValue" @change="handleChange(scope)" />
                    </template></el-table-column>
                  <el-table-column label="Y轴最大值" width="180px">
                    <template slot-scope="scope">
                      <a-input-number class="w-full" v-model="scope.row.maxRangeValue" @change="handleChange(scope)" />
                    </template></el-table-column>
                </el-table>
              </a-menu>
              <a-button style="margin-left: 8px"> 坐标轴设置 </a-button>
            </a-dropdown>
            <div>
              <el-button type="primary" size="small" @click="() => {
                sendData()
              }">发送数据</el-button>
            </div>
            <div>
              <el-button type="danger" size="small" @click="() => {
                clearData()
              }">重置数据</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pressure-chart class="relative" chartBackground="#000c37d9" :range-list="rangeList" chartId="pressureChart"
      :date-value="dateValue" :exist-error-date-value="existErrorDateValue"
      :construction-pressure-value="constructionPressureValue" :sand-concentration-value="sandConcentrationValue"
      :displacement-value="displacementValue" :changeLatestInfo="changeLatestInfo" :setIsRunning="setIsRunning"
      :setCurrentType="setCurrentType" :setCurrentId="setCurrentId" :chartOriginData="chartOriginData"
      :waitingTime="waitingTime" :setWaitingTime="setWaitingTime" :sandPlugLogData="sandPlugLogData"
      :onGetCurrentWarningData="onGetCurrentWarningData" />
  </div>
</template>

<script>
import {
  clearRecord,
  setMockData
} from '../../../api/SandPlugApi.js'
import PressureChart from '../../../components/ChartList/PressureChart/PressureChart.vue'
export default {
  name: 'PressureRelationshipChart',
  components: {
    PressureChart,
  },
  props: {
    dateValue: {
      default: () => [],
      type: Array,
    },
    existErrorDateValue: {
      default: () => [],
      type: Array,
    },
    constructionPressureValue: {
      default: () => [],
      type: Array,
    },
    sandConcentrationValue: {
      default: () => [],
      type: Array,
    },
    displacementValue: {
      default: () => [],
      type: Array,
    },
    changeLatestInfo: {
      type: Function,
      default: () => { },
    },
    sandPlugLogData: {
      type: Array,
      default: () => [],
    },
    setCurrentType: {
      type: Function,
      default: () => { },
    },
    setCurrentId: {
      type: Function,
      default: () => { },
    },
    setIsRunning: {
      type: Function,
      default: () => { },
    },
    chartOriginData: {
      default: () => [],
      type: Array,
    },
    waitingTime: {
      default: 0,
      type: Number,
    },
    setWaitingTime: {
      default: () => [],
      type: Function,
    },
    onGetCurrentWarningData: {
      default: () => [],
      type: Function,
    },
  },
  data () {
    return {
      tableData: [
        {
          id: 'constructionPressure',
          name: '泵压',
          maxRangeValue: undefined,
          minRangeValue: undefined,
          color: '#BF8F00',
        },
        {
          id: 'sandConcentration',
          name: '砂浓度',
          maxRangeValue: undefined,
          minRangeValue: undefined,
          color: '#ff00c8',
        },
        {
          id: 'displacement',
          name: '排量',
          maxRangeValue: undefined,
          minRangeValue: undefined,
          color: '#70B503',
        },
      ],
      rangeList: {},
    }
  },
  mounted () {
    this.rangeList = {
      [this.tableData[0].id]: this.tableData[0],
      [this.tableData[1].id]: this.tableData[1],
      [this.tableData[2].id]: this.tableData[2],
    }
  },
  methods: {
    handleChange (scope) {
      this.rangeList = {
        [this.tableData[0].id]: this.tableData[0],
        [this.tableData[1].id]: this.tableData[1],
        [this.tableData[2].id]: this.tableData[2],
      }
    },
    async clearData () {
      await clearRecord({
      })
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    },
    async sendData () {
      await clearRecord({
      })
      await setMockData({
      })
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  },
}
</script>

<style lang="less">
.pressureRelationshipChart {
  .ant-dropdown {
    min-width: 700px !important;
  }
}


.ant-input-number-handler-wrap {
  opacity: 1;
}

.ant-input-number {
  width: 100%;
}

.disconnectStatus {
  background: red;
}

.runningStatus {
  background: green;
}
</style>
