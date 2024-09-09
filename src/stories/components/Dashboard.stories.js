import Dashboard from "../../components/dashboard/Dashboard.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/Dashboard",
  component: Dashboard,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Dashboard },
    template:
      '<div style="width: 300px; height: 500px; background: black"><Dashboard v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};
export const defaultStatus = {
  args: {
    id: "defaultStatus",
    ...commonProps,
  },
};

export const hasValue = {
  args: {
    id: "defaultStatus",
    ...commonProps,
    value: 100,
  },
};
