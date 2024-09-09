<template>
  <div class="TopPage w-full h-full relative">
    <div class="px-4 h-full">
      <div class="flex z-10 pt-20 pb-4 h-full">
        <menu-base />
        <div class="flex-1">
          <div class="flex w-full h-full">
            <list-page v-if="mode === 'list'" />
            <map-page v-if="mode === 'map'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WellTypeMenu from "../../components/wellTypeMenu/WellTypeMenu.vue";
import WellList from "../../components/wellList/WellList.vue";
import menuBase from "../../components/menuBase/MenuBase.vue";
import listPage from "../ListPage/ListPage.vue";
import mapPage from "../MapPage/MapPage.vue";

export default {
  name: "TopPage",
  props: [],
  components: {
    WellTypeMenu,
    WellList,
    menuBase,
    listPage,
    mapPage
  },
  data () {
    return {
      mode: this.$route.query.mode || "list"
    };
  },
  watch: {
    $route () {
      this.mode = this.$route.query.mode || "list";
    }
  },
  methods: {
    goDetail () {
      this.$router.push({
        path: "/DrillVisualizationPage",
        query: { wellName: this.wellName }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/TopPage.less";
</style>
