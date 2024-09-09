import QuantityBarChart from "../../components/QuantityBarChart/QuantityBarChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/QuantityBarChart",
  component: QuantityBarChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { QuantityBarChart },
    template:
      '<div style="width: 500px; height: 800px; background: rgb(8, 38, 74)"><QuantityBarChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  type: "rotateRpm",
  unit: "rpm",
  realityData: 1,
  recommendedData: 2,
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
