<template>
  <div class="px-2" style="border: 0.125rem solid #12BDFF">
    <div>
      <span class="text-18" style="white-space: pre;">{{ title }}</span>
    </div>
    <div
      class="w-full flex justify-center gap-x-2 text-lg"
      style="color: #45e245"
    >
      <span>{{ data }}</span>
      <span>{{ unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "StateInfo",
  props: {
    title: {
      type: String,
      default: "----"
    },
    data: {
      type: [String, Number],
      default: "----"
    },
    unit: {
      type: [String, Number],
      default: "-"
    }
  }
};
</script>

<style lang="less"></style>
