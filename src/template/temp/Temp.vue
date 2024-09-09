<template>
  <div class="wellChart w-full h-full relative bgc">
    <div class="flex h-full font-color px-6 py-4">
      <div class="flex flex-1 h-full bg-div max-width70">
        <div class="ml-1">
          <div class="flex h-full">
            <div class="flex-1">
              <depth-selection
                :well-depth-data="wellDepthData"
                @sliderConfirm="sliderChange"
                :depth-limit="depthLimit"
              />
            </div>
            <!--TODO: 根据接口返回，目前先写死style颜色 -->
            <div
              class="flex flex-column flex-1 ml-4 px-2 level"
              style="width: 100px; margin-top: 2.5rem;height: calc(100% - 2.5rem)"
            >
              <div class="text-center">
                <span>层位</span>
              </div>
              <land-layer-chart
                chart-id="drillChart"
                :land-layer-data="landLayerData"
                :depth-limit="depthLimit"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-column w-full h-full">
          <div class="flex">
            <div
              v-for="(_, index) in this.chartCount"
              :key="index"
              class="flex-1"
            >
              <div
                class="w-full h-full flex align-end"
                style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
              >
                <chart-desc
                  class="h-full"
                  desc-name="descName"
                  :display-list="displayList[index]"
                  :style="`font-size: 1rem`"
                  :nameColor="getColor(index % 3)"
                  :strokeColor="getColor(index % 3)"
                />
              </div>
            </div>
          </div>
          <div
            class="flex w-full flex-1"
            style="color:#0aa2fa;border: 1px solid #0aa2fa;height: 0px"
          >
            <chart
              v-for="(_, index) in this.chartCount"
              :ref="`chartRef${index}`"
              :key="index"
              :chart-id="`chartId${index + 1}`"
              style="border-right: 1px solid #0aa2fa;"
              chart-background="#000c37d9"
              :display-list="displayList[index]"
              :depth="depth"
              :depth-limit="depthLimit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepthSelection from "../../components/depthSelection/DepthSelection.vue";
import ChartGroup from "../chartGroup/ChartGroup.vue";
import LandLayerChart from "../../components/landLayerChart/LandLayerChart.vue";
import Chart from "../../components/chart/Chart";
import ChartDesc from "../../components/chartDesc/ChartDesc";

import { getColor } from "../../utils/utils";
export default {
  name: "Temp",
  props: {
    titleSize: {
      default: "basic",
      type: String
    },
    wellDepthData: {
      type: Object,
      required: {}
    },
    displayList: {
      type: Array,
      default: [[], [], []]
    },
    depth: {
      type: Array,
      default: () => []
    }
  },
  components: {
    ChartGroup,
    DepthSelection,
    LandLayerChart,
    Chart,
    ChartDesc
  },
  watch: {
    wellDepthData: {
      handler() {
        // // 对page层返回的数据进行处理
        const landLayerData = [];
        Object.keys(this.wellDepthData).forEach(item => {
          landLayerData.unshift({
            horizonName: this.wellDepthData[item].horizonName,
            depth: item
          });
        });
        this.landLayerData = landLayerData;
      },
      deep: true
    },
    chartCount: {
      handler(value) {
        this.refreshChart(value);
      },
      deep: true
    },
    displayList: {
      handler(value) {
        if (!value) return;

        let count = 0;
        value.forEach(item => {
          count += item.length;
        });
        this.chartCount = count;
        this.refreshChart(count);
      },
      deep: true
    }
  },
  data() {
    return {
      landLayerData: [
        {
          horizonName: "J1b",
          depth: "3387.46"
        },
        {
          horizonName: "J1b",
          depth: "3386.99"
        },
        {
          horizonName: "J1b",
          depth: "3386.49"
        },
        {
          horizonName: "J1b",
          depth: "3385.99"
        },
        {
          horizonName: "J1b",
          depth: "3385.48"
        },
        {
          horizonName: "J1b",
          depth: "3384.98"
        },
        {
          horizonName: "J1b",
          depth: "3384.49"
        },
        {
          horizonName: "J1b",
          depth: "3383.98"
        },
        {
          horizonName: "N2d",
          depth: "3383.49"
        },
        {
          horizonName: "N2d",
          depth: "3382.99"
        },
        {
          horizonName: "N2d",
          depth: "3382.49"
        },
        {
          horizonName: "N2d",
          depth: "3381.89"
        },
        {
          horizonName: "N2d",
          depth: "3381.49"
        },
        {
          horizonName: "N2d",
          depth: "3380.98"
        },
        {
          horizonName: "N2d",
          depth: "3380.49"
        },
        {
          horizonName: "N2d",
          depth: "3379.99"
        },
        {
          horizonName: "T2k",
          depth: "3379.47"
        },
        {
          horizonName: "T2k",
          depth: "3378.98"
        },
        {
          horizonName: "T2k",
          depth: "3378.44"
        },
        {
          horizonName: "T2k",
          depth: "3378.04"
        }
      ],
      depthLimit: [],
      chartCount: 3
    };
  },
  methods: {
    getColor(index) {
      return getColor(index);
    },
    sliderChange(e) {
      this.depthLimit = e;
    },
    refreshChart(count) {
      this.$nextTick(() => {
        for (let i = 0; i < count; i++) {
          this.$refs[`chartRef${i}`][0].chart.resize();
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/WellChart.less";
</style>
