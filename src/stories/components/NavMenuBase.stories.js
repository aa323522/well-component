import NavMenuBase from "../../components/navMenuBase/NavMenuBase.vue";

// /** @type {import('@storybook/vue').StoryObj} */
/** @type {import('@storybook/vue').Meta} */
export default {
  title: "components/NavMenuBase",
  component: NavMenuBase,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { NavMenuBase },
    template:
      '<div style="width: 50px; height: 500px; background: rgb(8, 38, 74)"><NavMenuBase v-bind="$props" style="width: 100%; height: 100%"/></div>',
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
