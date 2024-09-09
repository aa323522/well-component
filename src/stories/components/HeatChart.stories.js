import HeatChart from "../../components/ChartList/HeatChart/HeatChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/HeatChart",
  component: HeatChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { HeatChart },
    template:
      '<div style="width: 400px; height: 500px; background: black"><HeatChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  mapData: [
    [32.6355, 18.7265, 18.99],
    [34.4865, 18.7265, 6.96],
    [38.1885, 18.7265, 11],
    [40.0395, 18.7265, 23],
    [36.3375, 20.7195, 149.95],
    [36.3375, 40.6495, 57.51],
    [36.3375, 48.6215, 3.82],
    [38.1885, 50.6145, 9.27],
    [36.3375, 54.6005, 9.27],
    [32.6355, 56.5935, 4.18],
  ],
  chartBackground: "#000c37d9",
};
export const defaultStatus = {
  args: {
    chartId: "defaultStatus",
    ...commonProps,
  },
};
