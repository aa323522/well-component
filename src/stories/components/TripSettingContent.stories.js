import TripSettingContent from "../../components/TripSettingContent/TripSettingContent.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/TripSettingContent",
  component: TripSettingContent,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { TripSettingContent },
    template:
      '<div style="width: 500px; height: 800px; background: rgb(8, 38, 74)"><TripSettingContent v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
