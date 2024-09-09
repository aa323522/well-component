import RiskHeaderItem from "../../components/RiskHeaderItem/RiskHeaderItem.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/RiskHeaderItem",
  component: RiskHeaderItem,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { RiskHeaderItem },
    template:
      '<div style="width: 200px; height: 500px; "><RiskHeaderItem v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  maxValue: 10,
  minValue: 1,
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
