import { defineNuxtPlugin } from 'nuxt/app'
import VueECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// ECharts GL (3D) - on-demand imports
import { Bar3DChart } from 'echarts-gl/charts'
import {
  Grid3DComponent,
  XAxis3DComponent,
  YAxis3DComponent,
  ZAxis3DComponent,
} from 'echarts-gl/components'

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  CanvasRenderer,
  BarChart,
  LineChart,
  ScatterChart,
  // 3D
  Bar3DChart,
  Grid3DComponent,
  XAxis3DComponent,
  YAxis3DComponent,
  ZAxis3DComponent,
])

export default defineNuxtPlugin((nuxtApp) => {
  // quick sanity log
  console.log('[nuxt-model-graphs] registering VChart')
  nuxtApp.vueApp.component('VChart', VueECharts)
})
