<template>
  <div class="mr-4 menu bgc">
    <div class="menu-guide flex align-center justify-between">
      <div>区块探索</div>
      <img src="../../assets/retract.png" alt="" class="retract" />
    </div>
    <div
      v-for="(item, index) in MenuList"
      :key="index"
      :class="isActive == index ? 'active' : ''"
      @click="showCurrent(item, index)"
    >
      <div class="menu-title flex align-center justify-between pointer">
        <div>{{ item.name }}</div>
        <img src="../../assets/menu.png" alt="" class="menu-icon" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuBase",
  data() {
    return {
      MenuList: [
        {
          name: "列表模式"
        },
        {
          name: "地图模式"
        },
        {
          name: "单井数据总览"
        },
        {
          name: "数据导入"
        },
        {
          name: "数据库管理"
        }
      ],
      isActive: -1
    };
  },
  mounted() {
    this.isActive = 0;
  },
  methods: {
    showCurrent(val, index) {
      this.isActive = index;
      if (index == 0) {
        this.$router.push({ path: "/TopPage" });
      } else if (index == 1) {
        this.$router.push({ path: "/TopPage?mode=map" });
        // this.$router.push({path: "/mapPage"});
      } else if (index == 2) {
        this.$router.push({ path: "/SingleWellOverviewPage" });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/MenuBase.less";
</style>
