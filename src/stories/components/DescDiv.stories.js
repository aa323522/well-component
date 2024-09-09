import DescDiv from "../../components/descDiv/DescDiv.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/DescDiv",
  component: DescDiv,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { DescDiv },
    template:
      '<div style="width: 200px; height: 200px"><DescDiv v-bind="$props" style="width: 100%; height: 100%"/></div>',
  }),
  argTypes: {},
};

const commonProps = {
  maxValue: 10,
  minValue: 0,
  name: "钻压",
  nameColor: "red",
};
export const defaultStatus = {
  args: commonProps,
};
