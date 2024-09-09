import DepthSelection from "../../components/depthSelection/DepthSelection.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/DepthSelection",
  component: DepthSelection,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { DepthSelection },
    template:
      '<div style="width: 100px; height:300px; background: black"><DepthSelection v-bind="$props"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  wellDepthData: {
    3500: { WELL_DEPTH: 1000, ROTATE_SPEED: 10, DATE: "10:30" },
    3600: { WELL_DEPTH: 1100, ROTATE_SPEED: 12, DATE: "11:30" },
    3700: { WELL_DEPTH: 1200, ROTATE_SPEED: 14, DATE: "12:30" },
    3800: { WELL_DEPTH: 1300, ROTATE_SPEED: 14, DATE: "12:30" },
    3900: { WELL_DEPTH: 1400, ROTATE_SPEED: 14, DATE: "12:30" },
  },
};
export const defaultStatus = {
  args: {
    id: "defaultStatus",
    ...commonProps,
  },
};

export const hiddenMark = {
  args: {
    id: "defaultStatus",
    ...commonProps,
    displayMark: false,
  },
};

export const hiddenTime = {
  args: {
    id: "defaultStatus",
    ...commonProps,
    displayTime: false,
  },
};
