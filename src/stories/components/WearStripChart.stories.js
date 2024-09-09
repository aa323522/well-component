import WearStripChart from "../../components/chartComponents/wearStripChart/WearStripChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WearStripChart",
  component: WearStripChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WearStripChart },
    template:
      '<div style="width: 200px; height: 500px"><WearStripChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  depth: [1000, 1100, 1200, 1300, 1400, 1500],
  chartData: [1, 2, 3, 4, 5, 6, 7],
  chartBackground: "#000c37d9",
};
export const defaultStatus = {
  args: {
    id: "1",
    ...commonProps,
  },
};

// 深度限制，用于range 条的 上下深度区间选取
export const depthLimit = {
  args: {
    depthLimit: [1000, 1100], // 数据区间，正常值应该有2个，例子为选取 1000米到 1300米的值
    ...commonProps,
  },
};
