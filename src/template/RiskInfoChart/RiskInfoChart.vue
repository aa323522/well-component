<template>
  <div class="chartLine flex flex-column">
    <div class="line-item" style="height:145px">
      <div class="flex justify-end w-full mr-2">
        <a-icon type="setting" class="pointer" @click="handleSettingBtnClick" />
      </div>
      <div
        v-for="item in headerItemList"
        :key="`${item.color} + one`"
        :style="`color: ${item.color};`"
        class="w-full"
      >
        <RiskHeaderItem
          v-if="!item.disable"
          :maxValue="getMax(item)"
          :minValue="getMin(item)"
          :name="item.name"
          :nameColor="item.color"
        />
      </div>
    </div>
    <div class="flex-1" style="pointer-events: auto">
      <LineChart
        :depth="depthList"
        :displayList="displayList"
        chartBackground="#000c37d9"
        :chartId="chartId"
        groupId="riskInfoChart"
        :chartZoomStart="chartZoomStart"
        :chartZoomEnd="chartZoomEnd"
        :setChartZoomStart="setChartZoomStart"
        :setChartZoomEnd="setChartZoomEnd"
        :bitDepthList="bitDepthList"
      />
    </div>
    <a-modal
      v-model="visible"
      title="特征值设置"
      width="700px"
      @ok="handleConfirm"
    >
      <el-table :data="tempDisplayList" style="width: 100%" border>
        <el-table-column prop="date" label="特征值名称" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px"
              >{{ scope.row.name }}({{ scope.row.unit }})</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="最小值">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.min"
              controls-position="right"
              placeholder="请输入最小值"
              :precision="0"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="最大值">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.max"
              placeholder="请输入最大值"
              controls-position="right"
              :precision="0"
            />
          </template>
        </el-table-column>
      </el-table>
    </a-modal>
  </div>
</template>

<script>
import LineChart from "@/components/ChartList/LineChart/LineChart.vue";
import RiskHeaderItem from "@/components/RiskHeaderItem/RiskHeaderItem.vue";
export default {
  name: "RiskInfoChart",
  components: { LineChart, RiskHeaderItem },
  props: {
    headerItemList: {
      type: Array,
      default: () => []
    },
    depthList: {
      type: Array,
      default: () => []
    },
    // 实际chart中拥有的曲线，目前表头由于后端API差一些数据，所以displayList中实际要比headerItemList 要少部分内容
    displayList: {
      type: Array,
      default: () => []
    },
    // 必填，chart的id
    chartId: {
      type: String,
      require: true
    },
    chartZoomStart: {
      type: Number,
      default: 100
    },
    chartZoomEnd: {
      type: Number || undefined
    },
    setChartZoomStart: {
      type: Function
    },
    setChartZoomEnd: {
      type: Function
    },
    setDisplayList: {
      type: Function
    },
    bitDepthList: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    visible: {
      handler() {
        this.tempDisplayList = this.displayList;
      }
    }
  },
  data() {
    return {
      // 设置最大最小值的范围modal visible
      visible: false,
      tempDisplayList: []
    };
  },
  methods: {
    handleSettingBtnClick() {
      this.visible = true;
    },
    getMax(item) {
      const data = this.displayList.find(displayItem => {
        return displayItem.name === item.name;
      });
      return data && data.max ? data.max : 0;
    },
    getMin(item) {
      const data = this.displayList.find(displayItem => {
        return displayItem.name === item.name;
      });
      return data && data.min ? data.min : 0;
    },
    handleConfirm() {
      this.visible = false;
      // 设置标记，让最大最小值保持不动
      const value = this.tempDisplayList.map(item => ({
        ...item,
        isSetMinMax: true
      }));
      this.setDisplayList(value, this.chartId);
    }
  }
};
</script>

<style lang="less">
.chartLine {
  min-width: 200px;
  width: 15%;
  .line-item {
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
