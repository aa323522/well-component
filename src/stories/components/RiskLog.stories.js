import riskLog from "../../components/riskLog/riskLog.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/riskLog",
  component: riskLog,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { riskLog },
    template:
      '<div style="width: 1000px; height: 500px; "><riskLog v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  type: "riskInfo",
  isShowLog: false,
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};

export const hasValue = {
  args: {
    ...commonProps,
    riskLogData: [
      {
        id: 2,
        wellId: "well4",
        wellDepth: 3616,
        time: "2022-07-06\n10:48",
        type: "溢流&卡钻",
        status: 1,
        remark: "备注",
        js: 3616,
        opt: 1,
        state: 3,
      },
      {
        id: 3,
        wellId: "well4",
        wellDepth: 3310,
        time: "2023-07-06\n10:48",
        type: "卡钻",
        status: 1,
        remark: "备注",
        js: 3310,
        opt: 1,
        state: 2,
      },
    ],
  },
};
