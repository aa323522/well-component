<template>
  <drill-visualization
    :well-depth-data="wellDepthData"
    :display-list="displayList"
    :bit-info="bitInfo"
    :well-list="wellList"
    :well-name="wellName"
    :onStatusSwitch="handleStatusSwitch"
    :is-running="isRunning"
    :setSpeedRadio="setSpeedRadio"
    :changeWellName="handleWellName"
  />
</template>

<script>
import DrillVisualization from "../../template/drillVisualization/DrillVisualization.vue";
import { getWellList, getDrillData } from "../../api/drillVisualizationApi.js";
import { max, min, cloneDeep } from "lodash";

export default {
  name: "DrillVisualizationPage",
  components: {
    DrillVisualization
  },
  data() {
    return {
      wellDepthData: {},
      displayList: [],
      bitInfo: {},
      timer: undefined,
      // API 用
      currentWellDepth: 0,
      a: 0,
      tempDisplayList: [],
      wob: {},
      isRunning: true,
      speedRadio: 1,
      wellList: [],
      wellName: ""
    };
  },
  watch: {
    isRunning: {
      handler(value) {
        if (value) {
          this.timer = setInterval(async () => {
            const isEnd = await this.getWellData(
              this.currentWellDepth,
              this.wellName
            );
            if (isEnd) clearInterval(this.timer);
          }, 10000 / this.speedRadio);
        } else {
          clearInterval(this.timer);
        }
      }
    },
    speedRadio: {
      handler(value) {
        clearInterval(this.timer);
        this.timer = setInterval(async () => {
          const isEnd = await this.getWellData(
            this.currentWellDepth,
            this.wellName
          );
          if (isEnd) clearInterval(this.timer);
        }, 10000 / value);
      }
    }
  },
  mounted() {
    this.handleGetWellName().then(res => {
      this.init();
    });
  },
  methods: {
    handleStatusSwitch() {
      this.isRunning = !this.isRunning;
    },
    async init() {
      const isEnd = await this.getWellData("", this.wellName);
      if (!isEnd)
        this.timer = setInterval(async () => {
          const isEnd = await this.getWellData(
            this.currentWellDepth,
            this.wellName
          );
          if (isEnd) clearInterval(this.timer);
        }, 10000 / this.speedRadio);
    },
    setSpeedRadio(speedRadio) {
      this.speedRadio = speedRadio;
    },

    handleWellName(value) {
      this.wellDepthData = {};
      clearInterval(this.timer);
      this.wellName = value.key;
      this.init();
    },
    async getWellData(wellDepth, well) {
      // dev;
      // const { data, success: isSuccess } = await getDrillData(
      //   { wellDepth, well },
      //   this.a
      // );
      // production
      const { data, success: isSuccess } = await getDrillData({
        wellDepth,
        well
      });
      if (isSuccess) {
        const mark = {};
        // 将后端返回数据，构建成DepthSelection.vue组件能够识别的数据

        this.bitInfo = {
          wellDepth: parseInt(data.wellDepth), // 当前井深
          bitType: data.bitType, // 钻头型号，先写死RTMS-
          bitDiameter: parseInt(data.bitDiameter), // 钻头直径
          drillingFootage: parseInt(data.drillingFootage), // 钻头进尺=钻头深度
          // 钻头磨损乘以12.5
          bitWear: parseInt(data.bitWear), // 钻头磨损
          footageTime: parseInt(data.footageTime), // 进尺时间
          rop: parseInt(data.rop), // 当前钻速
          preRop: parseInt(data.preRop) // 优化转速
          // isEnd: data.isEnd,
        };

        data.wellDepthList.forEach((item, index) => {
          const depthObj = {
            [item]: {
              horizonName: data.horizonNameList[index], // 地层名称
              WOB: data.wobList[index], // 钻压
              ROTATE_SPEED: data.rotateSpeedList[index], //转速
              PUMP_RATE: data.pumpRateList[index], // 排量
              BIT_WEAR: data.bitWearList[index] * 12.5, // 钻头磨损
              ROP: data.ropList[index], // 钻速

              DATE: `${this.dayjs(data.timeList[index]).format(
                "HH:mm"
              )} ${item}m`
            }
          };

          Object.assign(mark, depthObj);
        });

        this.currentWellDepth =
          data.wellDepthList[data.wellDepthList.length - 1];

        const wob = {
          max: parseInt(
            max([
              ...data.wobList,
              ...(wellDepth ? this.displayList[0][0].chartData : {})
            ])
          ),
          min: parseInt(
            min([
              ...data.wobList,
              ...(wellDepth ? this.displayList[0][0].chartData : {})
            ])
          ),
          name: "钻压",
          unit: "tone",
          chartData: [
            ...(wellDepth ? this.displayList[0][0].chartData : []),
            ...data.wobList
          ]
        };

        const rotateSpeed = {
          max: parseInt(
            max([
              ...data.rotateSpeedList,
              ...(wellDepth ? this.displayList[0][1].chartData : [])
            ])
          ),
          min: parseInt(
            min([
              ...data.rotateSpeedList,
              ...(wellDepth ? this.displayList[0][1].chartData : [])
            ])
          ),
          name: "转速",
          unit: "rpm",
          chartData: [
            ...(wellDepth ? this.displayList[0][1].chartData : []),
            ...data.rotateSpeedList
          ]
        };

        const pumpRate = {
          max: parseInt(
            max([
              ...data.pumpRateList,
              ...(wellDepth ? this.displayList[0][2].chartData : [])
            ])
          ),
          min: parseInt(
            min([
              ...data.pumpRateList,
              ...(wellDepth ? this.displayList[0][2].chartData : [])
            ])
          ),
          name: "排量",
          unit: "L/s",
          chartData: [
            ...(wellDepth ? this.displayList[0][1].chartData : []),
            ...data.pumpRateList
          ]
        };

        // TODO 乘以12.5
        // const bitWear = {
        //   max: parseInt(max(data.bitWearList) * 12.5),
        //   min: parseInt(min(data.bitWearList) * 12.5),
        //   name: "钻头磨损",
        //   color: "#f1d91e",
        //   unit: "%",
        //   chartData: data.bitWearList.map(item => item * 12.5)
        // };

        const bitWear = {
          max: parseInt(
            max([
              ...data.bitWearList.map(item => item * 12.5),
              ...(wellDepth ? this.displayList[1][0].chartData : [])
            ])
          ),
          min: parseInt(
            min([
              ...data.bitWearList.map(item => item * 12.5),
              ...(wellDepth ? this.displayList[1][0].chartData : [])
            ])
          ),
          name: "钻头磨损",
          unit: "%",
          chartData: [
            ...(wellDepth ? this.displayList[1][0].chartData : []),
            ...data.bitWearList.map(item => item * 12.5)
          ]
        };

        const rop = {
          max: parseInt(
            max([
              ...data.ropList,
              ...(wellDepth ? this.displayList[2][0].chartData : [])
            ])
          ),
          min: parseInt(
            min([
              ...data.ropList,
              ...(wellDepth ? this.displayList[2][0].chartData : [])
            ])
          ),
          name: "钻速",
          unit: "m/h",
          chartData: [
            ...(wellDepth ? this.displayList[2][0].chartData : []),
            ...data.ropList
          ]
        };

        const preRop = {
          max: parseInt(
            max([
              ...data.preRopList,
              ...(wellDepth ? this.displayList[2][1].chartData : [])
            ])
          ),
          min: parseInt(
            min([
              ...data.preRopList,
              ...(wellDepth ? this.displayList[2][1].chartData : [])
            ])
          ),
          name: "预测钻速",
          color: "#f5eeee",
          unit: "m/h",
          chartData: [
            ...(wellDepth ? this.displayList[2][1].chartData : []),
            ...data.preRopList
          ],
          lineType: "dashed"
        };
        // this.wellDepthData = mark
        const wellData = cloneDeep(this.wellDepthData);

        Object.assign(wellData, { ...mark });
        this.wellDepthData = wellData;
        this.displayList = [
          [wob, rotateSpeed, pumpRate],
          [bitWear],
          [rop, preRop]
        ];

        this.a++;
        return data.isEnd;
      }
    },
    async handleGetWellName() {
      const { success, data } = await getWellList();
      if (success != true && !isEmpty(data)) return;
      this.wellList = data;
      this.wellName = data[0];
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
