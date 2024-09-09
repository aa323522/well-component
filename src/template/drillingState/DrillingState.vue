<template>
  <div class="drillingState h-full">
    <div class="px-2 text-10 flex flex-column gap-y-2 h-full">
      <div class="flex flex-column gap-y-2">
        <div>
          <span>钻进状态展示</span>
        </div>
        <div class="flex gap-x-2">
          <div class="flex-1">
            <StateInfo title="当前井深" :data="currentDepth" unit="m" />
          </div>
          <div class="flex-1">
            <StateInfo title="当前层位" data="--" />
          </div>
        </div>
        <div class="flex py-2">
          <div class="flex-1 flex justify-center align-center radius-full">
            <div>
              <a-icon
                v-if="conditions == '钻进'"
                class="radius-full icon-path"
                style="background: black; height: 100px;width: 100px;fontSize:100px"
                type="arrow-down"
              />
              <span v-else 
                class="radius-full icon-path"
                style="background: black; height: 100px;width: 100px;fontSize:70px">----</span>
            </div>
          </div>
          <div class="flex-1 flex justify-center align-center">
            <span class="text-30 p-2" style="background: black">{{
              conditions
            }}</span>
          </div>
        </div>
        <div>
          <span>钻头信息</span>
        </div>
        <div class="p-2" style="border: 0.125rem solid #12BDFF">
          <div class="flex">
            <div style="width: 100px">型号</div>
            <div>{{ drillInfo.model }}</div>
          </div>
          <div class="flex">
            <div style="width: 100px">序列号</div>
            <div>{{ drillInfo.serialNumber }}</div>
          </div>
          <div class="flex align-center">
            <div style="width: 100px">直径</div>
            <div>--</div>
            <!-- <div>
               <span v-if="!isEditBitDiameter">
                {{ currentData.bitDiameter }}
                <a-icon type="edit" @click="() => {isEditBitDiameter = true}"/>
              </span> 
              <a-input-number v-if="isEditBitDiameter" @blur="handleEditBitDiameter" v-model="bitDiameterValue"/>
            </div> -->

          </div>
          <div class="flex">
            <div style="width: 100px">厂家</div>
            <div>{{ drillInfo.manufacturer }}</div>
          </div>
        </div>
        <div class="flex flex-column gap-y-2">
          <div class="flex gap-x-2">
            <StateInfo
              class="flex-1"
              title="钻头深度(m)"
              :data="currentData.bitDepth"
              unit=""
            />
            <StateInfo
              class="flex-1"
              title="钻头进尺(m)"
              :data="currentData.drillingFootage"
              unit=""
            />
          </div>
          <div class="flex gap-x-2">
            <StateInfo
              class="flex-1"
              title="进尺预测(m)"
              :data="currentData.bitFootage"
              unit=""
            />
            <StateInfo
              class="flex-1"
              title="进尺时间(min)"
              :data="currentData.drillingTime"
              unit=""
            />
          </div>
        </div>
        <div>
          <span>磨损表盘</span>
        </div>
      </div>
      <div class="flex-1">
        <worn-dial-chart :value="wearMonitoring" />
      </div>
    </div>
  </div>
</template>

<script>
import WornDialChart from "../../components/chartComponents/wornDialChart/wornDialChart.vue";
import StateInfo from "../../components/stateInfo/StateInfo.vue";
import {
  setBitDiameter,
} from "../../api/detectionAndImprovementApi.js";
export default {
  components: { StateInfo, WornDialChart },
  name: "DrillingState",
  props: {
    horizonName: {
      type: String
    },
    wearMonitoring: {
      type: Number,
      default: 0
    },
    currentDepth: {
      type: Number
    },
    // 实时状态
    currentData: {
      type: Object,
      default: () => {}
    },
    // 钻进状态
    conditions: {
      type: String,
      default: "----"
    }
  },
  watch: {
    currentData: {
      handler(v) {
        this.bitDiameterValue = v.bitDiameter
      },
      deep: true
    }
  },
  data() {
    return {
      isEditBitDiameter: false,
      bitDiameterValue: undefined,
      drillInfo: {
        model: "--",
        serialNumber: "--",
        bitDiameter: "--",
        manufacturer: "--"
      }
    };
  },
  methods: {
    handleEditBitDiameter () {
      this.isEditBitDiameter = false
      setBitDiameter({bitDiameter: this.bitDiameterValue})
    }
  }
};
</script>

<style lang="less">
.icon-path svg {
  animation: icon-path-animation 5s ease-in infinite;
}
@keyframes icon-path-animation {
  0% {
    stroke-dasharray: 0;
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dasharray: 4917;
    stroke-dashoffset: 4917;
    fill: #1875f000;
  }
}
</style>
