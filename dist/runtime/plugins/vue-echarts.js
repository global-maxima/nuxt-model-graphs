import { defineNuxtPlugin } from "nuxt/app";
import VueECharts from "vue-echarts";
import { use } from "echarts/core";
import { BarChart, LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
  BarChart,
  LineChart,
  ScatterChart
]);
export default defineNuxtPlugin((nuxtApp) => {
  console.log("[nuxt-model-graphs] registering VChart");
  nuxtApp.vueApp.component("VChart", VueECharts);
});
