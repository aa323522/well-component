import WellTypeMenu from "../../components/wellTypeMenu/WellTypeMenu.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WellTypeMenu",
  component: WellTypeMenu,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WellTypeMenu },
    template:
      '<div style="width: 300px; height: 900px; color: white"><WellTypeMenu v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = { wellName: "well1" };

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
