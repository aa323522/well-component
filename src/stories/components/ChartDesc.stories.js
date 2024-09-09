import ChartDesc from "../../components/chartDesc/ChartDesc.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/ChartDesc",
  component: ChartDesc,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ChartDesc },
    template:
      '<div style="width: 200px; height: 200px"><ChartDesc v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  displayList: [
    {
      max: 50,
      min: 12,
      name: "钻压",
      color: "#FF007A",
      unit: "kN",
      chartData: [12, 25, 30, 22, 15, 35, 14],
    },
  ],
  chartBackground: "#000c37d9",
};
export const defaultStatus = {
  args: {
    id: "defaultStatus",
    ...commonProps,
  },
};

// 多个，一般最大值为3
export const multiple = {
  args: {
    id: "multiple",
    displayList: [
      {
        max: 50,
        min: 12,
        name: "钻压",
        unit: "kN",
        color: "#FF007A",
        chartData: [12, 25, 30, 22, 15, 35, 14],
      },
      {
        max: 100,
        min: 10,
        name: "钻速",
        unit: "rop",
        color: "#00C2FF",
        chartData: [10, 30, 40, 50, 60, 70, 80],
      },
      {
        max: 110,
        min: 10,
        name: "流量",
        unit: "L/s",
        color: "#FFD400",
        chartData: [110, 66, 43, 22, 11, 23, 24],
      },
    ],
  },
};

export const customColor = {
  args: {
    ...commonProps,
    id: "customColor",
    nameColor: "blue",
    strokeColor: "red",
  },
};
