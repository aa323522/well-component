import ExportCsvButton from "../../components/ExportCsvButton/ExportCsvButton.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/ExportCsvButton",
  component: ExportCsvButton,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ExportCsvButton },
    template:
      '<div style="width: 100px;  background: black"><ExportCsvButton v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  wellList: ["well1"],
  bitInfo: {
    bitType: "01",
    bitDiameter: "10",
    bitWear: "50",
    drillingFootage: "1330",
    drillingFootage: "1320",
    footageTime: "140",
    bitWear: "140",
    wellDepth: "1234",
    drillingFootage: "123",
    rop: "32",
    preRop: "22",
  },
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
