import RiskConfirmContent from "../../components/RiskConfirmContent/RiskConfirmContent.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/RiskConfirmContent",
  component: RiskConfirmContent,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { RiskConfirmContent },
    template:
      '<div style="width: 200px; height: 500px; "><RiskConfirmContent v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  title: "名称",
  confirmVisible: false,
  currentData: {
    endTime: "2022-07-06 10:48:21",
    id: 1,
    remark: "",
    startTime: "2022-07-06 10:48:21",
    time: "2022-07-06\n10:48:21",
    type: "溢流&卡钻",
    wellDepth: 3616,
    wellId: "WELL1",
  },
};

export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
