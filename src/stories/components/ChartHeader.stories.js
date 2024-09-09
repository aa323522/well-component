import ChartHeader from "../../components/ChartList/ChartHeader/ChartHeader.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/ChartHeader",
  component: ChartHeader,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChartHeader },
    template:
      '<div style="width: 200px; height: 200px"><ChartHeader v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  colorList: ["red", "blue"],
  maxValue: 10,
  minValue: 0,
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};

export const overlay = {
  args: {
    ...commonProps,
    headerType: "overlay",
  },
};

export const nameAndUnit = {
  args: {
    ...commonProps,
    headerType: "overlay",
    name: "钻压",
    unit: "Kn",
    nameColor: "red",
  },
};
