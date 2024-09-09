import Chart from "../../components/chart/Chart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/Chart",
  component: Chart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Chart },
    template:
      '<div style="width: 500px; height: 800px; color: white"><Chart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  chartId: "chartId3",
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
  depthLimit: [],
  customSeriesData: [],
  tooltipUnit: "m",
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
