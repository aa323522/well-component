import SingleWellInfo from "../../components/singleWellInfo/SingleWellInfo.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/SingleWellInfo",
  component: SingleWellInfo,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SingleWellInfo },
    template:
      '<div style="width: 400px; height: 800px; background: rgb(8, 38, 74)"><SingleWellInfo v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
