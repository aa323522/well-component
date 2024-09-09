import WellDropDown from "../../components/WellDropDown/WellDropDown.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/WellDropDown",
  component: WellDropDown,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { WellDropDown },
    template:
      '<div style="width: 100px; height: 50px; color: white"><WellDropDown v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = { wellName: "well1" };

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
