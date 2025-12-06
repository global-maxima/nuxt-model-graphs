import { defineNuxtModule, createResolver, addPlugin, addComponentsDir } from '@nuxt/kit';

const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-model-graphs",
    configKey: "graphs"
  },
  defaults: {
    defaultHeight: 256
  },
  setup(options, nuxt) {
    const r = createResolver(import.meta.url);
    addPlugin(r.resolve("./runtime/plugins/vue-echarts"));
    addComponentsDir({
      path: r.resolve("./runtime/components/graphs"),
      pathPrefix: false
    });
    nuxt.options.alias["#modelGraph"] = r.resolve("./runtime/types/modelGraph");
  }
});

export { module$1 as default };
