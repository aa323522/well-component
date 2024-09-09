import LandLayerChart from "../../components/landLayerChart/LandLayerChart.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/LandLayerChart",
  component: LandLayerChart,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { LandLayerChart },
    template:
      '<div style="width: 300px; height: 300px; background: rgb(8, 38, 74)"><LandLayerChart v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  landLayerData: [
    { horizonName: "T2k", depth: 1000 },
    { horizonName: "J1b", depth: 1100 },
  ],
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
