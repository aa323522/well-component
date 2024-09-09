<template>
  <div
    class="flex flex-column h-full w-full"
    style="background: rgb(8, 38, 74);"
  >
    <div class="flex justify-between p-2 flex-1">
      <div>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleChangType">
            <a-menu-item v-for="item in typeList" :key="item">
              {{ item }}
            </a-menu-item>
          </a-menu>
          <div
            class="px-4 py-2"
            style="border-top: 0.125rem solid #12BDFF; background: linear-gradient(180deg, #080F26 0%, #0C1B4F 100%)"
          >
            {{ selectType }}
          </div>
        </a-dropdown>
      </div>
      <div>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="item in levelList" :key="item">
              {{ item }}{{ unit }}
            </a-menu-item>
          </a-menu>
          <div
            class="px-4 py-2"
            style="border-top: 0.125rem solid #12BDFF; background: linear-gradient(180deg, #080F26 0%, #0C1B4F 100%)"
          >
            {{ selectValue }}{{ unit }}
          </div>
        </a-dropdown>
      </div>
    </div>
    <HeatChart
      class="h-full"
      chartBackground="rgb(0 12 55)"
      :chartId="chartId"
      :mapData="mapData"
      :selectType="selectType"
    />
  </div>
</template>

<script>
import ChartHeader from "../../../components/ChartList/ChartHeader/ChartHeader";
import HeatChart from "../../../components/ChartList/HeatChart/HeatChart.vue";
import {
  getHeatMapMse,
  getHeatMapRop,
  getHeatMapMseByDepth,
  getHeatMapRopByDepth
} from "../../../api/detectionAndImprovementApi.js";
import { isEmpty } from "lodash";
export default {
  name: "HeatMap",

  components: {
    ChartHeader,
    HeatChart
  },
  props: {
    type: {
      type: String
    },
    chartId: {
      type: String,
      default: "heatMap"
    },
    // 米数或者层级
    levelList: {
      type: Array
    },
    unit: {
      type: String
    },
    wellName: {
      type: String
    },
    horizonName: {
      type: String
    },
    currentDepth: {
      type: Number,
      default: 0
    }
  },
  watch: {
    levelList: {
      handler(levelList) {
        if (!isEmpty(levelList)) {
          this.selectValue = levelList[0];
          this.$nextTick(() => {
            this.handleGetHeatMapMse();
          });
        }
      },
      deep: true,
      immediate: true
    },
    currentDepth: {
      handler() {
        this.$nextTick(() => {
          this.handleGetHeatMapMse();
        });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      selectType: "机械钻速",
      typeList: ["机械钻速", "机械比能"],
      selectValue: "",
      mapData: []
    };
  },
  mounted() {
    // Object.keys(wellDepthData).map(item => parseFloat(item))
  },
  methods: {
    async handleGetHeatMapMse() {
      if (!this.currentDepth && this.type === "recommend") {
        console.warn("缺少当前井深");
        return;
      }

      let fn;
      let params;
      if (this.type === "recommend") {
        fn =
          this.selectType === "机械钻速"
            ? getHeatMapRopByDepth
            : getHeatMapMseByDepth;
        params = {
          wellName: this.wellName,
          depth: parseInt(this.selectValue.replace("m", "")),
          wellDepth: this.currentDepth
        };
      } else if (this.type === "optimize") {
        fn = this.selectType === "机械钻速" ? getHeatMapRop : getHeatMapMse;

        params = {
          horizonName: this.selectValue,
          wellName: this.wellName
        };
      }

      const { success, data } = await fn(params);
      if (success != true) return;

      const mapData = data
        .filter(item => {
          return item.Color !== null;
        })
        .map(item => [item.X_Location, item.Y_Location, item.Color]);

      this.mapData = mapData;
    },
    handleMenuClick(e) {
      this.selectValue = e.key;
      this.handleGetHeatMapMse();
    },
    handleChangType(e) {
      this.selectType = e.key;
      this.handleGetHeatMapMse();
    }
  }
};
</script>

<style></style>
../../../api/DetectionAndImprovementApi.js
