import HistogramChart from "../../components/ChartList/HistogramChart/HistogramChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/HistogramChart",
  component: HistogramChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { HistogramChart },
    template:
      '<div style="width: 200px; height: 200px"><HistogramChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  displayList: [
    {
      max: 70,
      min: 0,
      name: "钻速",
      color: "#4ce791",
      unit: "kN",
      chartData: [10, 13, 13, 14, 20, 15, 14],
    },
  ],
  depth: [1000, 1100, 1200, 1300, 1400, 1500, 1600],
  chartBackground: "#000c37d9",
};
export const defaultStatus = {
  args: {
    chartId: "defaultStatus",
    ...commonProps,
  },
};
