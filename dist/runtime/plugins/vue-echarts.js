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
  const [
    { use },
    charts,
    components,
    renderers,
    { default: VueECharts }
  ] = await Promise.all([
    import("echarts/core"),
    import("echarts/charts"),
    import("echarts/components"),
    import("echarts/renderers"),
    import("vue-echarts")
  ]);
  use([
    renderers.CanvasRenderer,
    charts.BarChart,
    charts.LineChart,
    charts.ScatterChart,
    charts.HeatmapChart,
    components.GridComponent,
    components.TooltipComponent,
    components.LegendComponent,
    components.DatasetComponent,
    components.VisualMapComponent
  ]);
  await import("echarts-gl");
  nuxtApp.vueApp.component("VChart", VueECharts);
});
