import { defineNuxtPlugin } from "nuxt/app";
import { defineComponent, h } from "vue";
const VChartStub = defineComponent({
  name: "VChart",
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h("div", {
      id: attrs.id,
      class: attrs.class,
      style: attrs.style
    });
  }
});
export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.component("VChart", VChartStub);
    return;
  }
  console.log("[nuxt-model-graphs] registering VChart");
  await import("echarts-gl");
  const { default: VueECharts } = await import("vue-echarts");
  nuxtApp.vueApp.component("VChart", VueECharts);
});
