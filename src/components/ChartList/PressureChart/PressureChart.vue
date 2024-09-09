<template>
  <div class="chart w-full h-full">
    <div
      style="z-index: 10; bottom: 4px; position: absolute; left: 8px"
      class="flex align-center"
    >
      <a-icon
        style="font-size: 28px; left: 120px"
        class="pointer actionBtn"
        :type="isRunning ? 'pause-circle' : 'play-circle'"
        @click="handleStatusSwitch"
      />
      <el-select
        :disabled="!isRunning"
        v-model="speedValue"
        class="speedSelect"
        @change="handleSpeedChange"
      >
        <el-option
          v-for="item in speedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div :id="chartId" class="w-full h-full echart"></div>
    <div
      class="flex relative errorArea pointer-none"
      :style="
        `
      z-index: 0; bottom: 4px; position: absolute; left: ${205 /
        this.zoom}px; width: calc(100% - ${300 / this.zoom}px);height: ${30 /
          this.zoom}px; opacity: 0.5;`
      "
    >
      <div
        v-for="(item, index) in sandPlugLogData"
        :key="index"
        :style="
          `
        width: ${5 /
          zoom}px;background: red; position: absolute; left: ${handleGetPosition(
            item
          )}%;height: ${30 / zoom}px;`
        "
      ></div>
    </div>
  </div>
</template>

<script>
import {
  isEmpty,
  cloneDeep,
  throttle,
  findIndex,
  isUndefined,
  isNumber
} from "lodash";
import * as echarts from "echarts";
import { getFractureData } from "../../../api/SandPlugApi.js";
import dayjs from "dayjs";

export default {
  name: "PressureChart",
  props: {
    // description: 图表的唯一ID, 必填
    chartId: {
      default: "defaultChartId",
      type: String,
      required: true
    },
    // description: 图表的背景颜色
    // example: 'red'
    chartBackground: {
      default: "",
      type: String
    },
    rangeList: {
      type: Object
    },
    dateValue: {
      default: () => [],
      type: Array
    },
    existErrorDateValue: {
      default: () => [],
      type: Array
    },
    constructionPressureValue: {
      default: () => [],
      type: Array
    },
    sandConcentrationValue: {
      default: () => [],
      type: Array
    },
    displacementValue: {
      default: () => [],
      type: Array
    },
    changeLatestInfo: {
      type: Function,
      default: () => {}
    },
    setCurrentType: {
      type: Function,
      default: () => {}
    },
    setCurrentId: {
      type: Function,
      default: () => {}
    },
    setIsRunning: {
      type: Function,
      default: () => {}
    },
    chartOriginData: {
      default: () => [],
      type: Array
    },
    waitingTime: {
      default: 0,
      type: Number
    },
    setWaitingTime: {
      default: () => [],
      type: Function
    },
    onGetCurrentWarningData: {
      default: () => [],
      type: Function
    },
    sandPlugLogData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    dateValue: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true,
      immediate: true
    },
    rangeList: {
      handler() {
        this.$nextTick(() => {
          this.init();
        });
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      zoom: 1,
      chart: undefined,
      timer: undefined,
      isRunning: true,
      speedValue: 1,
      speedOptions: [
        {
          value: 1,
          label: "X1"
        },
        {
          value: 2,
          label: "X2"
        },
        {
          value: 4,
          label: "X4"
        },
        {
          value: 8,
          label: "X8"
        }
      ],
      start: 0,
      end: 100
    };
  },
  mounted() {
    // this.handleResizeZoom()
    this.$nextTick(() => {
      // window.addEventListener('resize', () => {
      //   this.handleResizeZoom()
      // })

      this.move(1);
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    diffSecondByDayjs(start, end) {
      const date1 = this.dayjs(start);
      const date2 = this.dayjs(end);
      let diffTime = Math.abs(date1.diff(date2, "second")); //获取两个时间对象相差的秒数，取绝对值。second是秒，传入day是相差的天数
      return diffTime;
    },
    handleGetPosition(data) {
      if (!isEmpty(this.constructionPressureValue)) {
        const foundIndex = this.constructionPressureValue.findIndex(item => {
          return item[0] == data.time;
        });
        const currentDiff = this.diffSecondByDayjs(
          this.constructionPressureValue[0][0],
          data.time
        );
        const countDiff = this.diffSecondByDayjs(
          this.constructionPressureValue[0][0],
          this.constructionPressureValue[
            this.constructionPressureValue.length - 1
          ][0]
        );
        return (currentDiff / countDiff) * 100;
      }
    },
    // handleResizeZoom () {
    //   let isMac = /macintosh|mac os x/i.test(navigator.userAgent) //苹果
    //   const ratio = isMac ? 2 : 1
    //   const windowRatio = window.screen.width * window.screen.height
    //   const currentRatio =
    //     document.documentElement.clientWidth *
    //     document.documentElement.clientHeight

    //   const zoom =
    //     currentRatio / windowRatio / (window.devicePixelRatio * ratio)
    //   document.body.style.zoom = zoom

    //   const chartDom = document.getElementById(this.chartId)
    //   chartDom.style.zoom = 1 / zoom
    //   this.chart && this.chart.resize()
    //   this.zoom = zoom
    // },
    handleSpeedChange(e) {
      clearInterval(this.timer);
      this.$nextTick(() => {
        this.move(e);
      });
    },

    move(speedRatio) {
      const timer = setInterval(async () => {
        this.getCurrentData();
      }, [3000 / speedRatio]);
      this.timer = timer;
    },
    async getCurrentData() {
      const { data } = await getFractureData();
      if (isEmpty(this.dateValue) || isEmpty(data) || data.success == false)
        return;

      if (data.warningLogDTO && data.warningLogDTO.id) {
        this.setWaitingTime(data.warningLogDTO.count);
        this.onGetCurrentWarningData();
      } else {
        this.setWaitingTime(0);
        this.setCurrentId(undefined);
        this.setCurrentType(undefined);
      }

      const latestInfo = {
        time: data.time, //时间
        pre_RESULT: data.pre_RESULT, //是否有砂堵风险
        total_PUMP_PRESSURE: data.total_PUMP_PRESSURE, //泵压
        pumping_LIQUID_CONCENTRATION: data.pumping_LIQUID_CONCENTRATION, //砂浓度
        pumping_FLUID_VOLUME_TOTAL: data.pumping_FLUID_VOLUME_TOTAL, //液量
        total_PUMP_DISPL: data.total_PUMP_DISPL, // 排量
        pumping_SAND_VOLUME: data.pumping_SAND_VOLUME, //砂量
        serial_NUMBER: data.serial_NUMBER //施工时间
      };

      this.chartOriginData.push(latestInfo);
      this.changeLatestInfo(latestInfo);
      const dateStr = data.time
        ? data.time
        : this.dayjs(this.dateValue[this.dateValue.length - 1])
            .add(1, "second")
            .valueOf();
      const latestDate = dateStr;
      this.dateValue.push(dateStr);

      const timeStamp = latestDate;
      this.constructionPressureValue.push([
        timeStamp,
        data.total_PUMP_PRESSURE
      ]);
      this.sandConcentrationValue.push([
        timeStamp,
        data.pumping_LIQUID_CONCENTRATION
      ]);
      this.displacementValue.push([timeStamp, data.total_PUMP_DISPL]);

      if (data.pre_RESULT !== 0 && data.pre_RESULT !== undefined) {
        this.existErrorDateValue.push(data.time);
      }

      const getRangeResult = (value, field) => {
        const currentValue = value[1];
        if (
          isEmpty(this.rangeList) ||
          isEmpty(field) ||
          isEmpty(this.rangeList[field])
        ) {
          return true;
        }
        let minRangeValue = this.rangeList[field].minRangeValue;
        let maxRangeValue = this.rangeList[field].maxRangeValue;

        if (minRangeValue == "" || minRangeValue == null) {
          minRangeValue = undefined;
        }
        if (maxRangeValue == "" || maxRangeValue == null) {
          maxRangeValue = undefined;
        }

        if (!isUndefined(minRangeValue) && !isUndefined(maxRangeValue)) {
          return currentValue >= minRangeValue && currentValue <= maxRangeValue;
        } else if (!isUndefined(minRangeValue)) {
          return currentValue >= minRangeValue;
        } else if (!isUndefined(maxRangeValue)) {
          return currentValue <= maxRangeValue;
        }
        return true;
      };
      let option = {
        series: [
          {
            yAxisIndex: 0,
            data: this.constructionPressureValue.filter(item =>
              getRangeResult(item, "constructionPressure")
            )
          },
          {
            yAxisIndex: 1,
            data: this.displacementValue.filter(item =>
              getRangeResult(item, "displacement")
            )
          },
          {
            yAxisIndex: 2,
            data: this.sandConcentrationValue.filter(item =>
              getRangeResult(item, "sandConcentration")
            )
          }
        ]
      };

      this.chart.setOption(option);
      this.chart.resize();

      if (data.success == false || isEmpty(data)) {
        this.setIsRunning(false);
      } else {
        this.setIsRunning(true);
      }
    },
    handleStatusSwitch() {
      if (this.isRunning) {
        clearInterval(this.timer);
      } else {
        this.move(this.speedValue);
      }
      this.isRunning = !this.isRunning;
    },
    init() {
      const getRangeResult = (value, field) => {
        const currentValue = value[1];
        if (
          isEmpty(this.rangeList) ||
          isEmpty(field) ||
          isEmpty(this.rangeList[field])
        ) {
          return true;
        }
        let minRangeValue = this.rangeList[field].minRangeValue;
        let maxRangeValue = this.rangeList[field].maxRangeValue;

        if (minRangeValue == "" || minRangeValue == null) {
          minRangeValue = undefined;
        }
        if (maxRangeValue == "" || maxRangeValue == null) {
          maxRangeValue = undefined;
        }
        if (!isUndefined(minRangeValue) && !isUndefined(maxRangeValue)) {
          return currentValue >= minRangeValue && currentValue <= maxRangeValue;
        } else if (!isUndefined(minRangeValue)) {
          return currentValue >= minRangeValue;
        } else if (!isUndefined(maxRangeValue)) {
          return currentValue <= maxRangeValue;
        }
        return true;
      };

      const that = this;
      const chartDom = document.getElementById(this.chartId);

      if (!this.chart) this.chart = echarts.init(chartDom);
      let option = {
        title: {
          text: "ABC12345第3段",
          textStyle: {
            color: "white",
            fontSize: 30
          },
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          formatter: data => {
            const tooltipHtml = data
              .map((axis, index) => {
                const unit =
                  axis.seriesName == "泵压"
                    ? "MPa"
                    : axis.seriesName == "排量"
                    ? "m³/min"
                    : "%";
                return `<div style="color: ${data[index].color}">${
                  data[index].seriesName
                }:${
                  !isUndefined(data[index].value[1])
                    ? data[index].value[1]
                    : "-"
                } ${unit}</div>`;
              })
              .join("");
            return `
              <div style="font-size: 16px">
                <div style="font-size:20px;font-weight: bold">${that
                  .dayjs(data[0].axisValue)
                  .format("YYYY-MM-DD HH:mm:ss")}</div>
                ${tooltipHtml}
              </div>
            `;
          }
        },
        color: ["#BF8F00", "#70B503", "#ff00c8"],
        legend: {
          top: "50px",
          data: ["泵压", "砂浓度", "排量"],
          icon: "rect",
          textStyle: {
            color: "initial",
            fontSize: 24
          },
          formatter: text => {
            return `${text}`;
          }
        },
        grid: {
          top: 120,
          left: 200,
          right: 100,
          bottom: 120,
          containLabel: false
        },
        dataZoom: [
          {
            filterMode: "empty",
            start: this.start,
            end: this.end,
            moveHandleStyle: {
              color: "rgba(249, 248, 242, 1)"
            },
            handleSize: 50,
            moveHandleSize: 12
          }
        ],
        xAxis: {
          type: "time",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "white"
            }
          },
          axisLabel: {
            show: true,
            fontSize: 16,
            hideOverlap: true,
            padding: 8,
            formatter: function(value, index) {
              const text = that
                .dayjs(value)
                .format("YYYY-MM-DD HH:mm:ss")
                .split(" ")
                .join("\n");
              return text;
            }
          },
          axisTick: {
            length: 0
          },
          axisPointer: {
            show: true,
            type: "line",
            snap: true
          },
          splitLine: {
            show: true
          }
        },
        yAxis: [
          {
            splitNumber: 5,
            name: "泵压(MPa)",
            position: "left",
            type: "value",
            alignTicks: true,
            offset: 30,
            axisPointer: {
              show: false,
              type: "line"
            },
            nameLocation: "middle",
            nameRotate: 90,
            axisLabel: {
              formatter: value => {
                return value.toFixed(2);
              },
              fontSize: 20,
              margin: -20
            },
            nameTextStyle: {
              align: "left",
              fontSize: 20,
              verticalAlign: "top",
              lineHeight: 0
            },
            axisLine: {
              lineStyle: {
                color: "#BF8F00"
              }
            },
            min: function(value) {
              return value.min - (value.max - value.min) / 3;
            },
            max: function(value) {
              return value.max + (value.max - value.min) / 3;
            },
            nameGap: 50
          },
          {
            splitNumber: 5,
            name: "排量(m³/min)",
            position: "left",
            type: "value",
            alignTicks: true,
            offset: 140,
            axisLabel: {
              formatter: value => {
                return value.toFixed(2);
              },
              fontSize: 20,
              margin: -30
            },
            axisPointer: {
              show: false,
              type: "line"
            },
            nameLocation: "middle",
            nameRotate: 90,
            nameTextStyle: {
              align: "left",
              fontSize: 20,
              verticalAlign: "top",
              lineHeight: 0
            },
            axisLine: {
              lineStyle: {
                color: "#70B503"
              }
            },
            min: function(value) {
              return value.min - (value.max - value.min) / 3;
            },
            max: function(value) {
              return value.max + (value.max - value.min) / 3;
            },
            nameGap: 40
          },
          {
            splitNumber: 5,
            name: "砂浓度(%)",
            type: "value",
            alignTicks: true,
            offset: 15,
            axisLabel: {
              formatter: value => {
                return value.toFixed(2);
              },
              fontSize: 20
            },
            axisPointer: {
              show: false,
              type: "line"
            },
            nameLocation: "middle",
            nameRotate: 90,
            nameTextStyle: {
              align: "left",
              fontSize: 20,
              verticalAlign: "top",
              lineHeight: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ff00c8"
              }
            },
            nameGap: 0,
            min: function(value) {
              if (isNumber(value.min) && isNumber(value.max))
                return value.min - (value.max - value.min) / 3;
            },
            max: function(value) {
              if (isNumber(value.min) && isNumber(value.max))
                return value.max + (value.max - value.min) / 3;
            }
          }
        ],
        series: [
          {
            show: true,
            name: "泵压",
            yAxisIndex: 0,
            type: "line",
            symbol: "none",
            lineStyle: {
              color: "#BF8F00"
            },
            data: this.constructionPressureValue.filter(item =>
              getRangeResult(item, "constructionPressure")
            )
          },
          {
            yAxisIndex: 1,
            name: "排量",
            type: "line",
            symbol: "none",
            lineStyle: {
              color: "#70B503"
            },
            data: this.displacementValue.filter(item =>
              getRangeResult(item, "displacement")
            )
          },
          {
            yAxisIndex: 2,
            name: "砂浓度",
            type: "line",
            symbol: "none",
            lineStyle: {
              color: "#ff00c8"
            },
            data: this.sandConcentrationValue.filter(item =>
              getRangeResult(item, "sandConcentration")
            )
          }
        ],
        backgroundColor: "#0D112A"
      };

      // 共通 window变化 resize 配置
      option && this.chart.setOption(option);
      this.chart.on("datazoom", params => {
        this.start = params.start;
        this.end = params.end;
      });
    }
  }
};
</script>

<style lang="less">
.speedSelect {
  input {
    width: 70px;
    color: white;
    background: #000c3700 !important;
    border-color: #000c3700 !important;
  }

  .el-input__icon {
    display: none;
  }
}

.pointer-none {
  pointer-events: none;
}
</style>
