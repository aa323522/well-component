import ChartGroup from "../../template/chartGroup/ChartGroup.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/ChartGroup",
  component: ChartGroup,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChartGroup },
    template:
      '<div style="width: 200px; height: 800px"><ChartGroup v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  isCanSettingMinMax: true,
  settingMinMax: {
    minValue: 0,
    maxValue: 30,
  },
  titleSize: "basic",
  chartId: "recommendedChart-1",
  chartBackground: "#000c37d9",
  displayItem: [
    {
      name: "实际钻压",
      unit: "tone",
      chartData: [10.87, 16.87, 16.87, 16.87, 16.87, 10.87, 10.87],
      minValue: 0,
      maxValue: 30,
      color: "#4ff4fe",
      max: 16.87,
      min: 10.87,
    },
    {
      name: "优化钻压",
      unit: "tone",
      chartData: [30.87, 60.87, 60.87, 60.87, 60.87, 0, 0],
      minValue: 0,
      maxValue: 30,
      color: "#4273ea",
      max: 60.87,
      min: 30.87,
    },
  ],
  depthLimit: [],
  depth: [3380.04, 3381.04, 3382.04, 3383.04, 3384.04, 3478.04, 3478.04],
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};

export const noSettingMinMax = {
  args: {
    ...commonProps,
    isCanSettingMinMax: false,
  },
};
