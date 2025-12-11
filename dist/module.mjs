import { defineNuxtModule, createResolver, addImports, addComponentsDir, addPlugin } from '@nuxt/kit';
import { defu } from 'defu';

const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-model-graphs",
    configKey: "graphs"
  },
  defaults: {
    defaultHeight: 256
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const runtimeDir = resolver.resolve("./runtime");
    nuxt.options.runtimeConfig.public.graphs = defu(
      nuxt.options.runtimeConfig.public.graphs,
      {
        defaultHeight: options.defaultHeight
      }
    );
    addImports({
      name: "useChartExplorer",
      as: "useChartExplorer",
      from: resolver.resolve(runtimeDir, "composables/useChartExplorer")
    });
    addComponentsDir({
      path: resolver.resolve(runtimeDir, "components/graphs"),
      pathPrefix: false
    });
    addPlugin({
      src: resolver.resolve(runtimeDir, "plugins/vue-echarts")
    });
    nuxt.options.alias["#nuxt-model-graphs/runtime"] = runtimeDir;
    nuxt.options.alias["#chart"] = resolver.resolve(runtimeDir, "types/chart");
    nuxt.hook("prepare:types", ({ references }) => {
      references.push({
        path: resolver.resolve(runtimeDir, "types/chart.ts")
      });
    });
  }
});

export { module$1 as default };
