import WellInfo from "../../components/wellInfo/WellInfo.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WellInfo",
  component: WellInfo,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WellInfo },
    template:
      '<div style="width: 300px; height: 800px; color: white"><WellInfo v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = { wellName: "well1" };

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
