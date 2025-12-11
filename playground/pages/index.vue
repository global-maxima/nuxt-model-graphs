<script setup lang="ts">
import ModelGraphRenderer from '../../src/runtime/components/graphs/ModelGraphRenderer.vue'
import type {
  ChartType,
  UnivariateChartType,
  BivariateChartType,
  UnivariateSeries,
  BivariateSeries,
  BivariateDatum,
} from '#modelGraph'
import { univariate, bivariate, series } from '#modelGraph'
import { ref, computed } from 'vue'

// ============================================================================
// UNIVARIATE DATA (1 dimension → 1 value)
// ============================================================================

const univariateData: UnivariateSeries[] = [
  series('series-a', 'Series A', [
    univariate('Jan', 10),
    univariate('Feb', 18),
    univariate('Mar', 25),
    univariate('Apr', 15),
    univariate('May', 30),
  ]),
  series('series-b', 'Series B', [
    univariate('Jan', 7),
    univariate('Feb', 12),
    univariate('Mar', 17),
    univariate('Apr', 10),
    univariate('May', 21),
  ]),
]

// ============================================================================
// BIVARIATE DATA (2 dimensions → 1 value)
// ============================================================================

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const hours = ['9am', '12pm', '3pm', '6pm']

const bivariateData: BivariateSeries[] = [
  series(
    'activity',
    'User Activity',
    days.reduce<BivariateDatum[]>(
      (acc, day) => [
        ...acc,
        ...hours.map((hour) =>
          bivariate(day, hour, Math.floor(Math.random() * 20) + 1)
        ),
      ],
      []
    )
  ),
]

// ============================================================================
// CHART TYPE SELECTION
// ============================================================================

type ChartOption<T extends ChartType = ChartType> = {
  label: string
  value: T
  category: 'univariate' | 'bivariate'
}

const chartOptions: ChartOption[] = [
  { label: 'Line', value: 'lineGraph', category: 'univariate' },
  { label: 'Bar', value: 'verticalBarGraph', category: 'univariate' },
  { label: 'Scatter', value: 'scatterPlot', category: 'univariate' },
  { label: '3D Bar', value: 'barGraph3D', category: 'bivariate' },
]

const selectedType = ref<ChartType>('lineGraph')

const selectedCategory = computed(() =>
  chartOptions.find((o) => o.value === selectedType.value)?.category ?? 'univariate'
)

const isUnivariate = computed(() => selectedCategory.value === 'univariate')
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
      <!-- Chart type selector -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300">Graph type:</span>
        <div class="inline-flex rounded border border-slate-700 overflow-hidden">
          <button
            v-for="t in chartOptions"
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

      <!-- Data category indicator -->
      <div class="text-xs text-slate-500">
        Data shape:
        <span class="text-slate-300 font-mono">
          {{ isUnivariate ? 'UnivariateDatum { dimension, value }' : 'BivariateDatum { dimensionX, dimensionY, value }' }}
        </span>
      </div>

      <!-- Univariate charts -->
      <ModelGraphRenderer
        v-if="isUnivariate"
        style="height: 300px"
        :type="(selectedType as UnivariateChartType)"
        :series="univariateData"
      />

      <!-- Bivariate charts -->
      <ModelGraphRenderer
        v-else
        style="height: 400px"
        :type="(selectedType as BivariateChartType)"
        :series="bivariateData"
      />
    </section>

    <section class="max-w-3xl w-full text-xs text-slate-500 space-y-2">
      <p v-if="isUnivariate">
        <strong class="text-slate-400">Univariate data:</strong>
        months on X axis, numeric values on Y axis. Two series shown.
      </p>
      <p v-else>
        <strong class="text-slate-400">Bivariate data:</strong>
        days × hours grid with random activity values. Color encodes intensity.
      </p>
      <p class="text-slate-600">
        If all chart modes render correctly with tooltips working, the module and type system are correctly wired.
      </p>
    </section>
  </div>
</template>