import RecommendedParameters from "../../components/RecommendedParameters/RecommendedParameters.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/RecommendedParameters",
  component: RecommendedParameters,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { RecommendedParameters },
    template:
      '<div style="width: 1980px; height: 800px; background: rgb(8, 38, 74)"><RecommendedParameters v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  levelList: ["ROP"],
  wellName: "wellName1",
  horizonName: "horizonName1",
};
export const defaultStatus = {
  args: {
    ...commonProps,
  },
};
