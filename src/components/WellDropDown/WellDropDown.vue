<template>
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
</template>

<script>
import { isEmpty } from "lodash";
import { getWellList } from "../../api/detectionAndImprovementApi.js";
export default {
  props: {
    wellName: {
      type: String
    },
    setWellName: {
      type: Function,
      default: () => {}
    }
  },
  name: "DetectionAndImprovement",
  components: {},
  data() {
    return {
      wellList: []
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.handleGetWellName();
    },
    async handleGetWellName() {
      const { success, data } = await getWellList();
      if (success != true && !isEmpty(data)) return;
      this.wellList = data;
      this.setWellName(data[0]);
    },
    handleMenuClick(e) {
      this.setWellName(e.key);
    }
  }
};
</script>

<style lang="less"></style>
