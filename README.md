# **nuxt-model-graphs**

Reusable Nuxt module providing typed graph components (line, bar, scatter) and a unified renderer for visualizing model-driven data using ECharts. Designed for cross-app reuse with shared types, auto-registered components, and optional configuration.

---

## **Features**

- Auto-registered graph components  
- Shared TypeScript models (`ModelGraphProps`, `DataSeries`, etc.)  
- Unified `<ModelGraphRenderer>` that selects graph type at runtime  
- ECharts `<VChart>` plugin included  
- Lightweight, framework-conformant Nuxt 4 module  

---

## **Installation**

```bash
npm install git+ssh://git@github.com/your-org/nuxt-model-graphs.git
# or pnpm / yarn equivalent
```

Add to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-model-graphs'],
})
```

---

## **Usage**

```vue
<script setup lang="ts">
import type { ModelGraphProps, DataSeries } from '#modelGraph'

const model: ModelGraphProps = { /* ... */ }
const series: DataSeries[] = [ /* ... */ ]
</script>

<template>
  <ModelGraphRenderer
    :model="model"
    :series="series"
    type="lineGraph"
  />
</template>
```

Graph components (`<LineGraph>`, `<BarGraph>`, `<ScatterPlot>`) are also available directly.

---

## **Configuration (optional)**

```ts
export default defineNuxtConfig({
  modules: ['nuxt-model-graphs'],
  graphs: {
    defaultHeight: 300,
  },
})
```

---

## **Development**

```bash
pnpm i
pnpm dev
```

---

## **License**

MIT
