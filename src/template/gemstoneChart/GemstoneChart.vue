<template>
  <div class="GemstoneChart w-full h-full relative">
    <div class="pl-2 pr-4 h-full">
      <div class="flex z-10 h-full">
        <div class="flex flex-1 h-full bg-div p-1 max-width70">
          <div class="flex flex-column w-full h-full">
            <div class="flex">
              <div class="flex-1" style="border-left: 1px solid #0aa2fa;">
                <chart-desc
                  :display-list="displayList[0]"
                  :style="`font-size: 1rem`"
                />
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-full flex align-end"
                  style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
                >
                  <chart-desc
                    class="h-full"
                    :display-list="displayList[1]"
                    :style="`font-size: 1.25rem`"
                  />
                </div>
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-full flex align-end"
                  style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
                >
                  <chart-desc
                    class="h-full"
                    :display-list="displayList[2]"
                    :style="`font-size: 1.5rem`"
                  />
                </div>
              </div>
              <div class="flex-1">
                <div
                  class="w-full h-full flex align-end"
                  style="color:#0aa2fa;border-left: 1px solid #0aa2fa;border-right: 1px solid #0aa2fa;"
                >
                  <chart-desc
                    class="h-full"
                    :display-list="
                      displayList[3].length ? [displayList[3][0]] : []
                    "
                    :style="`font-size: 1.5rem`"
                  />
                </div>
              </div>
            </div>
            <div
              class="flex w-full flex-1"
              style="color:#0aa2fa;border: 1px solid #0aa2fa;"
            >
              <chart
                chart-id="chartId1"
                style="border-right: 1px solid #0aa2fa;"
                chart-background="#000c37d9"
                :display-list="displayList[0]"
                :depth="warningDate"
                :custom-options="dateOptions"
                :custom-y-axis="yAxis"
                tooltipUnit=""
                :depth-limit="depthLimit"
              />
              <chart
                chart-id="chartId211"
                style="border-right: 1px solid #0aa2fa;"
                chart-background="#000c37d9"
                :display-list="displayList[1]"
                :depth="warningDepth"
                :custom-options="options"
                :custom-y-axis="yAxis"
                :depth-limit="depthLimit"
              />
              <chart
                chart-id="chartId3"
                style="border-right: 1px solid #0aa2fa;"
                chart-background="#000c37d9"
                :display-list="displayList[2]"
                :depth="depth"
                :custom-options="optionsBasic"
                :depth-limit="depthLimit"
              />
              <chart
                chart-id="chartId4"
                chart-background="#000c37d9"
                :display-list="displayList[3]"
                :depth="depth"
                :custom-options="optionsBasic"
                :depth-limit="depthLimit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DepthSelection from "../../components/depthSelection/DepthSelection.vue";
import BitInfoChart from "../../components/BitInfoChart/BitInfoChart.vue";
import ChartDesc from "../../components/chartDesc/ChartDesc.vue";
import DescDiv from "../../components/descDiv/DescDiv.vue";
import LandLayerChart from "../../components/landLayerChart/LandLayerChart.vue";
import WellInfo from "../../components/wellInfo/WellInfo.vue";
import DrillBitInfo from "../../components/drillBitInfo/DrillBitInfo.vue";
import navMenuBase from "../../components/navMenuBase/NavMenuBase.vue";
import Chart from "../../components/chart/Chart.vue";
export default {
  name: "GemstoneChart",
  components: {
    LandLayerChart,
    DepthSelection,
    ChartDesc,
    BitInfoChart,
    WellInfo,
    DrillBitInfo,
    navMenuBase,
    Chart,
    DescDiv
  },
  props: {
    // description: 表头的值
    // example: [{
    //   max: 89.23,
    //   min: 17.73,
    //   name: "钻压",
    //   color: "#4ce791",
    //   unit: "kN",
    //   chartData: [
    //     60.87,
    //     23.76,
    //     20.64,
    //   ]
    //  }
    // ]
    displayList: {
      type: Array,
      default: () => [[], [], [], []]
    },
    depth: {
      type: Array,
      default: () => []
    },
    date: {
      type: Array,
      default: () => []
    },
    // description: 深度轴的区间
    // example: [3000, 4000]
    depthLimit: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    displayList: {
      handler() {
        this.initData();
      },
      deep: true,
      immediate: true
    },
    depth: {
      handler() {
        this.initData();
      },
      deep: true,
      immediate: true
    },
    date: {
      handler() {
        this.initData();
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      warningDate: [],
      warningDepth: [],
      dateOptions: {
        grid: {
          left: 80,
          top: 10,
          right: 0,
          bottom: 10
        }
      },
      options: {
        grid: {
          left: 50,
          top: 10,
          right: 0,
          bottom: 10
        }
      },
      optionsBasic: {
        grid: {
          left: 0,
          top: 10,
          right: 0,
          bottom: 10
        }
      },
      yAxis: {
        show: true,
        axisLabel: {
          show: true,
          fontSize: 16
        }
      }
    };
  },
  mounted() {
    // Object.keys(wellDepthData).map(item => parseFloat(item))
  },
  methods: {
    initData() {
      const date = [];
      const depth = [];

      const normalColor = "#00a7f7";
      const warningColor = "red";
      if (!this.displayList) return;
      if (this.depth) {
        this.depth.forEach((item, index) => {
          const isWarning = this.displayList[3][0].chartData[index] >= 0.4;
          depth.push({
            value: item,
            textStyle: {
              color: isWarning ? warningColor : normalColor
            }
          });
        });
      }
      if (this.date) {
        this.date.forEach((item, index) => {
          const isWarning = this.displayList[3][0].chartData[index] > 0.4;
          date.push({
            value: item,
            depth: this.depth[index],
            textStyle: {
              color: isWarning ? warningColor : normalColor
            }
          });
        });
      }
      this.warningDate = date;
      this.warningDepth = depth;
    }
  }
};
</script>

<style lang="less">
@import "../../style/drillVisualization.less";
</style>
