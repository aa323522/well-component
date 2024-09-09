<template>
  <div class="wellInfo w-full h-full bgc">
    <div class="title flex justify-between">
      <div class="tab-title flex align-center justify-center" @click="onChange('tab1')">井身结构</div>
      <div class="tab-title flex align-center justify-center" @click="onChange('tab2')">钻具组合</div>
    </div>
    <img src="../../assets/info.png" alt="">
  </div>
</template>

<script>
export default {
  name: "WellInfo",
  data () {
    return {
    };
  },
  mounted () { },
  methods: {
    onChange (flag) {

    }
  }
};
</script>

<style lang="less">
@import "../../style/WellInfo.less";
</style>
