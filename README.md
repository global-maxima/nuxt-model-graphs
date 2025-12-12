# **nuxt-model-graphs**

Schema-driven charting for Nuxt 4, powered by ECharts. Define dimensions and measures once, pick a graph kind, and let the renderer derive the right series/axes (including 3D) with shared, typed models.

---

## **What’s inside**

- Schema/selection-first API with typed helpers (`ChartSchema`, `ChartSelection`, `GraphKind`, etc.) exposed via `#chart`
- Single `<ChartRenderer>` that converts raw rows into the right series for `line`, `bar`, `area`, `scatter`, `bar3d`, or `matrix` heatmaps
- Auto-registered graph components and the bundled `<VChart>` plugin
- `useChartExplorer` composable for UI-driven dimension/measure selection
- Runtime config (`graphs.defaultHeight`) to control default renderer height

---

## **Install**

```bash
pnpm add https://github.com/global-maxima/nuxt-model-graphs.git
# or npm / yarn equivalent
```

Enable the module:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-model-graphs'],
  graphs: {
    defaultHeight: 256, // optional override
  },
})
```

---

## **Quick start**

```vue
<script setup lang="ts">
import type { ChartSchema, ChartSelection, DataRow, GraphKind } from '#chart'

type Dim = 'month' | 'channel'
type Mea = 'revenue'

const schema: ChartSchema<Dim, Mea> = {
  dimensions: [
    { id: 'month', label: 'Month' },
    { id: 'channel', label: 'Channel' },
  ],
  measures: [{ id: 'revenue', label: 'Revenue' }],
}

const selection: ChartSelection<Dim, Mea> = {
  dimensions: ['month', 'channel'],
  measures: ['revenue'],
}

const data: DataRow<Dim, Mea>[] = [
  { month: 'Jan', channel: 'Web', revenue: 120 },
  { month: 'Jan', channel: 'Retail', revenue: 80 },
]

const graphKind: GraphKind = 'bar'
</script>

<template>
  <ChartRenderer
    :data="data"
    :schema="schema"
    :selection="selection"
    :graph-kind="graphKind"
    :encoding="{ showLegend: true }"
  />
</template>
```

Components (`<LineGraph>`, `<BarGraph>`, `<ScatterPlot>`, `<BarGraph3D>`, `<MatrixGraph>`) remain available if you want to pass pre-built `chartData`, but `<ChartRenderer>` is the primary entry point.

---

## **Interactive selection**

```ts
const explorer = useChartExplorer(schema, {
  defaultDimensions: ['month'],
  defaultMeasures: ['revenue'],
  defaultGraphKind: 'line',
})

// explorer.selection, explorer.graphKind, explorer.availableGraphKinds, etc.
```

Bind `explorer.selection` and `explorer.graphKind` to `<ChartRenderer>` for a lightweight chart explorer UI.

---

## **Development**

```bash
pnpm i
pnpm dev
```

---

## **License**

MIT
