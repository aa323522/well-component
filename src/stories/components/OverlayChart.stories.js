import OverlayChart from "../../components/ChartList/OverlayChart/OverlayChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/OverlayChart",
  component: OverlayChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { OverlayChart },
    template:
      '<div style="width: 200px; height: 500px"><OverlayChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  depth: [1000, 1100, 1200, 1300, 1400, 1500],
  displayList: [
    {
      max: 50,
      min: 12,
      name: "钻压",
      color: "#FF007A",
      unit: "kN",
      chartData: [12, 25, 30, 22, 15, 35, 14],
    },
  ],
  chartBackground: "#000c37d9",
};

// 深度限制，用于range 条的 上下深度区间选取
export const depthLimit = {
  args: {
    ...commonProps,
    depthLimit: [1000, 1300], // 数据区间，正常值应该有2个，例子为选取 1000米到 1300米的值
  },
};

// 多条线配置， displayList 多个参数即可
export const MultipleLines = {
  args: {
    ...commonProps,
    displayList: [
      {
        max: 50,
        min: 12,
        name: "钻压",
        unit: "kN",
        color: "#FF007A",
        chartData: [12, 25, 30, 22, 15, 35, 14],
      },
      {
        max: 100,
        min: 10,
        name: "钻速",
        unit: "rop",
        color: "#00C2FF",
        chartData: [10, 30, 40, 50, 60, 70, 80],
      },
      {
        max: 110,
        min: 10,
        name: "流量",
        unit: "L/s",
        color: "#FFD400",
        chartData: [110, 66, 43, 22, 11, 23, 24],
      },
    ],
  },
};
// 传递的内容会覆盖组件内默认设置， 下例子为关闭 tooltip的显示，具体配置可参考echart配置项
export const customChartData = {
  args: {
    ...commonProps,
    customChartData: {
      tooltip: {},
    },
  },
};
