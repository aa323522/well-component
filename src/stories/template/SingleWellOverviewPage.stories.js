import SingleWellOverviewPage from "../../template/SingleWellOverviewPage/SingleWellOverviewPage.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "template/SingleWellOverviewPage",
  component: SingleWellOverviewPage,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SingleWellOverviewPage },
    template:
      '<div style="width: 1900px; height: 800px"><SingleWellOverviewPage v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
