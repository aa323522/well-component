import WellList from "../../components/wellList/WellList.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WellList",
  component: WellList,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WellList },
    template:
      '<div style="width: 500px; height: 800px; color: white"><WellList v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
