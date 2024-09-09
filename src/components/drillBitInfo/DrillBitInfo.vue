<template>
  <div class="drillBitInfo w-full h-full">
    <div class="info-large">
      <div class="info-box">
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="item in wellList" :key="item">
              {{ item }}
            </a-menu-item>
          </a-menu>
          <div
            class="px-4 py-2"
            style="border-top: 0.125rem solid #12BDFF; background: linear-gradient(180deg, #080F26 0%, #0C1B4F 100%)"
          >
            {{ wellName }}
          </div>
        </a-dropdown>
        <div class="title flex justify-between align-center">
          <div>钻头信息</div>
          <div class="drill-bit-menu pointer" @click="onMenu">
            <img src="../../assets/menu.png" alt="" />
          </div>
        </div>
        <div v-if="isShow" class="info-content">
          <h3>钻头信息</h3>
          <div class="info flex justify-between align-center">
            <div>型号:RTMS-{{ bitInfo.bitType }}</div>
            <div>直径:{{ bitInfo.bitDiameter }}mm</div>
          </div>
          <div class="number-box">
            <div class="number-box-item">
              <div class="text-24">钻头磨损</div>
              <div class="text-center warn-number">{{ bitInfo.bitWear }}%</div>
            </div>
            <div class="number-box-item">
              <div class="text-24">钻头进尺</div>
              <div class="text-center number">
                {{ bitInfo.drillingFootage }}m
              </div>
            </div>
            <div class="number-box-item">
              <div class="text-24">钻头深度</div>
              <div class="text-center warn-number">
                {{ bitInfo.drillingFootage }}m
              </div>
            </div>
            <div class="number-box-item">
              <div class="text-24">进尺时间</div>
              <div class="text-center number">{{ bitInfo.footageTime }}min</div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-box">
        <div class="title flex justify-between align-center">
          <div>
            钻头磨损{{ bitInfo.bitWear }}%
            <span v-if="bitInfo.bitWear > 80">建议更换钻头</span>
          </div>
          <div class="drill-bit-menu pointer" @click="onMenu1">
            <img src="../../assets/menu.png" alt="" />
          </div>
        </div>
        <div v-if="isShow1" class="info-content">
          <div class="info flex justify-between align-center">
            <div>型号:RTMS-{{ bitInfo.bitType }}</div>
            <div>直径:{{ bitInfo.bitDiameter }}mm</div>
          </div>
          <div class="number-box">
            <div class="number-box-item">
              <div class="text-24">当前井深</div>
              <div class="text-center number">{{ bitInfo.wellDepth }}m</div>
            </div>
            <div class="number-box-item">
              <div class="text-24">钻头深度</div>
              <div class="text-center number">
                {{ bitInfo.drillingFootage }}m
              </div>
            </div>
          </div>
          <div class="number-box">
            <div class="number-box-item">
              <div class="text-24">当前钻速</div>
              <div class="text-center number">{{ bitInfo.rop }}m/h</div>
            </div>
            <div class="number-box-item">
              <div class="text-24">预测钻速</div>
              <div class="text-center number">
                {{ handleNullValue(bitInfo.preRop) }}m/h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="current">
      <div class="current-info text-center">
        <div class="title">当前工况</div>
        <div class="result">钻进</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DrillBitInfo",
  props: {
    bitInfo: {
      type: Object,
      default: () => {}
    },
    wellList: {
      type: Array,
      default: () => []
    },
    wellName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isShow: true,
      isShow1: true
    };
  },
  computed: {
    handleNullValue() {
      return function(val) {
        return val ? val : "----";
      };
    }
  },
  mounted() {},
  methods: {
    onMenu() {
      this.isShow = !this.isShow;
    },
    onMenu1() {
      this.isShow1 = !this.isShow1;
    },
    handleMenuClick(e) {
      this.$emit("changeWellName",e)
    }
  }
};
</script>

<style lang="less">
@import "../../style/DrillBitInfo.less";
</style>
