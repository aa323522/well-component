import SandPlug from "../../../template/SandPlug/SandPlug.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "template/SandPlug",
  component: SandPlug,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SandPlug },
    template:
      '<div style="width: 1900px; height: 800px"><SandPlug v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
