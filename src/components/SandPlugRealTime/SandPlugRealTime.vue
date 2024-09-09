<template>
  <div class="SandPlugRealTime">
    <div class="info-box flex flex-column h-full">
      <div class="title flex justify-between align-center">
        <div>压裂实时数据</div>
        <div class="drill-bit-menu pointer" @click="onMenu">
          <img src="../../assets/menu.png" alt="" />
        </div>
      </div>
      <div v-if="isShow"
        class="flex-1 h-full info-content flex flex-column justify-between align-center py-4 text-bold gap-y-4">
        <div class="number-box-item text-center">
          <div class="">泵压(MPa)</div>
          <div class="number oneline" style="color: #bf8f00">
            {{ latestInfo.total_PUMP_PRESSURE }}
          </div>
        </div>
        <div class="number-box-item text-center">
          <div class="">排量(m³/min)</div>
          <div class="number oneline" style="color: #70b503">
            {{ latestInfo.total_PUMP_DISPL }}
          </div>
        </div>
        <div class="number-box-item text-center">
          <div class="">砂浓度(kg/m³)</div>
          <div class="number oneline" style="color: #ff00c8">
            {{ latestInfo.pumping_LIQUID_CONCENTRATION }}
          </div>
        </div>
        <div class="number-box-item text-center">
          <div class="">液量(m³)</div>
          <div class="number oneline" style="color: #019b94">
            {{ latestInfo.pumping_FLUID_VOLUME_TOTAL }}
          </div>
        </div>
        <div class="number-box-item text-center">
          <div class="">砂量(m³)</div>
          <div class="number oneline" style="color: #7d3afa">
            {{ latestInfo.pumping_SAND_VOLUME }}
          </div>
        </div>
        <div class="number-box-item text-center">
          <div class="">施工时间(s)</div>
          <div class="number oneline" style="color: #7d3afa">
            {{ latestInfo.serial_NUMBER }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SandPlugRealTime',
  props: {
    latestInfo: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      isShow: true,
    }
  },
  methods: {
    onMenu () {
      this.isShow = !this.isShow
    },
  },
}
</script>

<style lang="less">
@import '../../style/SandPlugRealTime.less';
</style>
