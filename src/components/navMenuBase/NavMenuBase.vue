<template>
  <div class="navMenuBase flex flex-column align-center menu-list">
    <div
      v-for="(item, index) in menuList"
      :key="index"
      class="menu-item"
      @click="goHome(index)"
    >
      <el-tooltip
        class="item"
        effect="dark"
        :content="item.title"
        :open-delay="500"
        placement="right"
      >
        <img :src="item.img" alt="" class="pointer" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "navMenuBase",
  data() {
    return {
      menuList: [
        {
          title: "区块探索",
          img: require("../../assets/menu1.png")
        },
        {
          title: "钻井实时监测",
          img: require("../../assets/menu2.png")
        },
        {
          title: "钻井提速Demo",
          img: require("../../assets/menu4.png")
        },
        {
          title: "宝石风险",
          img: require("../../assets/menu5.png")
        },
        {
          title: "帮助中心",
          img: require("../../assets/menu3.png")
        }
      ]
    };
  },
  methods: {
    goHome(index) {
      if (index == 0) {
        this.$router.push("/");
      } else if (index == 2) {
        this.$router.push("/DrillVisualizationPage");
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/navMenuBase.less";
</style>
