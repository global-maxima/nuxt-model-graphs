<script setup lang="ts">
import ModelGraphRenderer from '../../src/runtime/components/graphs/ModelGraphRenderer.vue'
import type {
  ModelGraphProps,
  DataSeries,
  AvailableGraphType,
} from '#modelGraph'

// Minimal valid ModelGraphProps
const model: ModelGraphProps = {
  measures: [],          // WeeklyMeasureId[]
  xAxis: 'scheduleWeek', // satisfies Dimension
  yAxis: 'observationWeek',
}

const points = [
  { x: 'Jan', y: 10 },
  { x: 'Feb', y: 18 },
  { x: 'Mar', y: 25 },
  { x: 'Apr', y: 15 },
  { x: 'May', y: 30 },
]

const series = ref<DataSeries[]>([
  {
    id: 'series-a',
    label: 'Series A',
    data: points,
  },
  {
    id: 'series-b',
    label: 'Series B',
    data: points.map((p) => ({ x: p.x, y: p.y * 0.7 })),
  },
])

const graphTypes: { label: string; value: AvailableGraphType }[] = [
  { label: 'Line', value: 'lineGraph' },
  { label: 'Vertical Bars', value: 'verticalBarGraph' },
  { label: 'Scatter', value: 'scatterPlot' },
]

const selectedType = ref<AvailableGraphType>('lineGraph')
</script>

<template>
  <div class="min-h-screen flex flex-col items-center gap-8 p-8 bg-slate-950 text-slate-100">
    <header class="max-w-3xl w-full flex flex-col gap-2">
      <h1 class="text-2xl font-semibold">nuxt-model-graphs playground</h1>
      <p class="text-sm text-slate-400">
        Switch graph types to verify the module wiring, ECharts plugin, and shared types.
      </p>
    </header>

    <section class="max-w-3xl w-full flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300">Graph type:</span>
        <div class="inline-flex rounded border border-slate-700 overflow-hidden">
          <button
            v-for="t in graphTypes"
            :key="t.value"
            class="px-3 py-1.5 text-xs transition-colors"
            :class="selectedType === t.value
              ? 'bg-slate-200 text-slate-900'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'"
            @click="selectedType = t.value"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
      <ModelGraphRenderer
        style="height:300px"
        :model="model"
        :series="series"
        :type="selectedType"
        />
    </section>

    <section class="max-w-3xl w-full text-xs text-slate-500">
      <p>
        Data: months on X axis, numeric values on Y axis. If you see all three modes render and
        tooltips work, the module and plugins are correctly wired.
      </p>
    </section>
  </div>
</template>
