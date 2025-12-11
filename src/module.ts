// src/module.ts
import {
  defineNuxtModule,
  addPlugin,
  addComponentsDir,
  addImports,
  createResolver,
} from '@nuxt/kit'
import { defu } from 'defu'

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
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    // 1. Expose options to runtimeConfig.public
    // This allows access via useRuntimeConfig().public.graphs.defaultHeight
    nuxt.options.runtimeConfig.public.graphs = defu(
      nuxt.options.runtimeConfig.public.graphs as any,
      {
        defaultHeight: options.defaultHeight
      }
    )

    // 2. Explicitly register Composable
    // Using explicit addImports is more reliable for local playgrounds than addImportsDir
    addImports({
      name: 'useChartExplorer',
      as: 'useChartExplorer',
      from: resolver.resolve(runtimeDir, 'composables/useChartExplorer')
    })

    // 3. Register Graph components
    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components/graphs'),
      pathPrefix: false,
    })

    // 4. Register Vue-Echarts plugin
    addPlugin(resolver.resolve(runtimeDir, 'plugins/vue-echarts'))

    // 5. Setup Alias for internal imports
    nuxt.options.alias['#nuxt-model-graphs/runtime'] = runtimeDir

    // 6. Type aliases for Chart types
    nuxt.options.alias['#chart'] = resolver.resolve(runtimeDir, 'types/chart')

    // 7. Extend TypeScript config to include our types
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolver.resolve(runtimeDir, 'types/chart.ts'),
      })
    })
  },
})
