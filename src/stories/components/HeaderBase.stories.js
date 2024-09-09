import HeaderBase from "../../components/headerBase/HeaderBase.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/HeaderBase",
  component: HeaderBase,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { HeaderBase },
    template:
      '<div style="width: 1980px; height: 300px; background: rgb(8, 38, 74)"><HeaderBase v-bind="$props" style="width: 1980px; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
