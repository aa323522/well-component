import GaugeChart from "../../components/GaugeChart/GaugeChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/GaugeChart",
  component: GaugeChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { GaugeChart },
    template:
      '<div style="width: 300px; height: 500px; background: rgb(8, 38, 74)"><GaugeChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  chartId: "id3",
  realityData: 15.43,
  recommendedData: 36.43,
  unit: "rpm",
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
