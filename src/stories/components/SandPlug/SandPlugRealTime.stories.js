import SandPlugRealTime from "../../../components/SandPlugRealTime/SandPlugRealTime.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/SandPlug/SandPlugRealTime",
  component: SandPlugRealTime,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { SandPlugRealTime },
    template:
      '<div style="width: 200px; height: 800px; background: rgb(8, 38, 74)"><SandPlugRealTime v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  latestInfo: {
    total_PUMP_PRESSURE: 12,
    total_PUMP_DISPL: 99.333,
    pumping_LIQUID_CONCENTRATION: 2,
    pumping_FLUID_VOLUME_TOTAL: 1132,
    pumping_SAND_VOLUME: 312,
    serial_NUMBER: 232,
  },
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
