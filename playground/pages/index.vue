<script setup lang="ts">
import type { ChartSchema, DataRow } from '../../src/runtime/types/chart'
import { useChartExplorer } from '../../src/runtime/composables/useChartExplorer'
// ============================================================================
// SCHEMA
// ============================================================================

type Dim = 'month' | 'product'
type Mea = 'sales' | 'profit'

const schema: ChartSchema<Dim, Mea> = {
  dimensions: [
    { id: 'month', label: 'Month' },
    { id: 'product', label: 'Product Line' },
  ],
  measures: [
    { id: 'sales', label: 'Revenue ($)' },
    { id: 'profit', label: 'Profit ($)' },
  ],
}

// ============================================================================
// DATA
// ============================================================================

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
const products = ['Widget', 'Gadget', 'Gizmo']

const data: DataRow<Dim, Mea>[] = []
for (const month of months) {
  for (const product of products) {
    data.push({
      month,
      product,
      sales: Math.floor(Math.random() * 100) + 50,
      profit: Math.floor(Math.random() * 30) + 10,
    })
  }
}

// ============================================================================
// EXPLORER
// ============================================================================

const {
  dimensionIds,
  measureIds,
  selectedDimensions,
  selectedMeasures,
  availableGraphKinds,
  graphKind,
  selection,
  toggleDimension,
  toggleMeasure,
} = useChartExplorer(schema, {
  defaultDimensions: ['month'],
  defaultMeasures: ['sales'],
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center gap-8 p-8 bg-slate-950 text-slate-100">
    <header class="max-w-3xl w-full flex flex-col gap-2">
      <h1 class="text-2xl font-semibold">Chart Explorer Playground</h1>
      <p class="text-sm text-slate-400">
        Select dimensions and measures to explore the data. Available graph types update based on your selection.
      </p>
    </header>

    <section class="max-w-3xl w-full flex flex-col gap-4">
      <!-- Dimension picker -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300 w-24">Dimensions:</span>
        <div class="inline-flex rounded border border-slate-700 overflow-hidden">
          <button
            v-for="id in dimensionIds"
            :key="id"
            class="px-3 py-1.5 text-xs transition-colors"
            :class="selectedDimensions.includes(id)
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'"
            @click="toggleDimension(id)"
          >
            {{ id }}
          </button>
        </div>
      </div>

      <!-- Measure picker -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300 w-24">Measures:</span>
        <div class="inline-flex rounded border border-slate-700 overflow-hidden">
          <button
            v-for="id in measureIds"
            :key="id"
            class="px-3 py-1.5 text-xs transition-colors"
            :class="selectedMeasures.includes(id)
              ? 'bg-green-600 text-white'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'"
            @click="toggleMeasure(id)"
          >
            {{ id }}
          </button>
        </div>
      </div>

      <!-- Graph kind picker -->
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300 w-24">Chart type:</span>
        <div class="inline-flex rounded border border-slate-700 overflow-hidden">
          <button
            v-for="kind in availableGraphKinds"
            :key="kind"
            class="px-3 py-1.5 text-xs transition-colors"
            :class="graphKind === kind
              ? 'bg-slate-200 text-slate-900'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'"
            @click="graphKind = kind"
          >
            {{ kind }}
          </button>
        </div>
        <span v-if="availableGraphKinds.length === 0" class="text-xs text-slate-500 italic">
          Select at least one dimension and measure
        </span>
      </div>

      <!-- Selection info -->
      <div class="text-xs text-slate-500 font-mono">
        {{ selectedDimensions.length }} dim × {{ selectedMeasures.length }} mea
        → {{ availableGraphKinds.length }} chart types available
      </div>

      <!-- Chart -->
      <ChartRenderer
        class="bg-slate-900 border border-slate-700 rounded-md p-4"
        :data="data"
        :schema="schema"
        :selection="selection"
        :graph-kind="graphKind"
      />
    </section>

    <section class="max-w-3xl w-full text-xs text-slate-500 space-y-1">
      <p><strong class="text-slate-400">1 dimension:</strong> X axis categories</p>
      <p><strong class="text-slate-400">2 dimensions:</strong> X axis + legend (2D) or X + Y axis (3D)</p>
      <p><strong class="text-slate-400">Multiple measures:</strong> Multiple series on same chart</p>
    </section>
  </div>
</template>