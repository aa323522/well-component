import RightTitle from "../../components/RightTitle/RightTitle.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/RightTitle",
  component: RightTitle,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { RightTitle },
    template:
      '<div style="width: 200px; height: 500px"><RightTitle v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  title: "名称",
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
