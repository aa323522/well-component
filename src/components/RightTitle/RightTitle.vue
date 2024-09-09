<!--
 * @Descripttion:
 * @version:
 * @Author: China University of Petroleum
 * @Date: 2023-04-10 19:53:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-23 09:00:37
-->
<template>
  <div class="right-title">
    <div>
      <div class="title-logo"></div>
      <div class="title-text">{{ title }}</div>
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  name: "RightTitle",
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
.right-title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background: #000c37d9;

  .title-logo {
    height: 26px;
    background: rgba(63, 133, 237, 1);
    width: 4px;
    display: inline-block;
    vertical-align: middle;
  }

  .title-text {
    display: inline-block;
    font-size: 24px;
    line-height: 26px;
    // font-weight: 650;
    margin-left: 10px;
    vertical-align: middle;
    color: #ffffff;
  }
}
</style>
