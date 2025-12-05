import { defineNuxtModule, addComponentsDir, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  defaultHeight?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-model-graphs',
    configKey: 'graphs',
  },
  defaults: {
    defaultHeight: 256,
  },
  setup (options: ModuleOptions, nuxt: any) {
    const r = createResolver(import.meta.url)

    // vue-echarts + theme plugins
    addPlugin(r.resolve('./runtime/plugins/vue-echarts'))

    // graph components
    addComponentsDir({
      path: r.resolve('./runtime/components/graphs'),
      pathPrefix: false,
    })


    // shared types
    nuxt.options.alias['#modelGraph'] = r.resolve('./runtime/types/modelGraph')
  },
})
