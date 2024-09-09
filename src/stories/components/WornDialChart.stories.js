import WornDialChart from "../../components/chartComponents/wornDialChart/wornDialChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WornDialChart",
  component: WornDialChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WornDialChart },
    template:
      '<div style="width: 300px; height: 500px"><WornDialChart v-bind="$props" style="width: 300px; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  value: 1,
};
export const normal = {
  args: {
    ...commonProps,
  },
};

export const warning = {
  args: {
    value: 3,
  },
};

export const critical = {
  args: {
    value: 8,
  },
};
