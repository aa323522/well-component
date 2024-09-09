import DetectionAndImprovement from "../../template/detectionAndImprovement/DetectionAndImprovement.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/DetectionAndImprovement",
  component: DetectionAndImprovement,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { DetectionAndImprovement },
    template:
      '<div style="width: 200px; height: 800px"><DetectionAndImprovement v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
