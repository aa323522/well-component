import WellMap from "../../components/wellMap/WellMap.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WellMap",
  component: WellMap,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WellMap },
    template:
      '<div style="width: 500px; height: 800px; color: white"><WellMap v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
