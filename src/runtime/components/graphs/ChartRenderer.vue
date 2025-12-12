<template>
  <div class="w-full relative" :style="containerStyle">
    
    <component
      :is="graphComponent"
      v-if="graphComponent && hasData"
      :chart-data="chartData"
      :encoding="encoding"
      v-bind="graphProps"
      class="w-full h-full" 
    />

    <div 
      v-else 
      class="flex items-center justify-center w-full h-full text-sm text-gray-400 bg-gray-50/50"
    >
      No data to display
    </div>
  </div>
</template>

<script setup lang="ts" generic="D extends string, M extends string">
import { computed, type Component } from 'vue'
import type {
  ChartProps,
  GraphKind,
  ChartData,
  ChartData2D,
  ChartData3D,
  DataRow,
} from '../../types/chart'
import {
  getDimensionId,
  getDimensionLabel,
  getMeasureId,
  getMeasureLabel,
} from '../../types/chart'

import LineGraph from './LineGraph.vue'
import BarGraph from './BarGraph.vue'
import BarGraph3D from './BarGraph3D.vue'
import MatrixGraph from './MatrixGraph.vue'
import ScatterPlot from './ScatterPlot.vue'
import { useRuntimeConfig } from 'nuxt/app'

const props = defineProps<ChartProps<D, M> & { height?: number}>()
// ============================================================================
// STYLING & CONFIG
// ============================================================================

const config = useRuntimeConfig()
const defaultHeight = config.public.graphs.defaultHeight

const containerStyle = computed(() => {
  // Priority: 
  // 1. Explicit prop passed to component
  // 2. Default height from nuxt.config (module options)
  const h = props.height ?? defaultHeight
  
  // Handle number vs string (e.g. 300 vs '300px' vs '100%')
  return {
    height: typeof h === 'number' ? `${h}px` : h
  }
})

// ============================================================================
// COMPONENT MAPPING
// ============================================================================

const graphComponentMap: Record<GraphKind, Component> = {
  line: LineGraph,
  bar: BarGraph,
  scatter: ScatterPlot,
  area: LineGraph,
  bar3d: BarGraph3D,
  matrix: MatrixGraph,
}

const graphComponent = computed(() => graphComponentMap[props.graphKind])
const graphProps = computed(() =>
  props.graphKind === 'area'
    ? { areaFill: true }
    : {}
)

// ============================================================================
// SCHEMA HELPERS
// ============================================================================

const dimensionDefs = computed(() => {
  const map = new Map<D, (typeof props.schema.dimensions)[number]>()
  for (const def of props.schema.dimensions) {
    map.set(getDimensionId(def), def)
  }
  return map
})

const measureDefs = computed(() => {
  const map = new Map<M, (typeof props.schema.measures)[number]>()
  for (const def of props.schema.measures) {
    map.set(getMeasureId(def), def)
  }
  return map
})

function dimLabel(id: D): string {
  const def = dimensionDefs.value.get(id)
  return def ? getDimensionLabel(def) : id
}

function meaLabel(id: M): string {
  const def = measureDefs.value.get(id)
  return def ? getMeasureLabel(def) : id
}

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

const usesGridData = computed(() =>
  props.graphKind === 'bar3d' || props.graphKind === 'matrix'
)

const chartData = computed<ChartData>(() => {
  const { data, selection } = props
  const { dimensions, measures } = selection

  if (data.length === 0 || dimensions.length === 0 || measures.length === 0) {
    return { mode: '2d', categories: [], series: [] }
  }

  if (usesGridData.value && dimensions.length >= 2) {
    return build3DData(data, dimensions, measures[0])
  }

  return build2DData(data, dimensions, measures)
})

const hasData = computed(() => {
  const cd = chartData.value
  if (cd.mode === '2d') {
    return cd.series.length > 0
  }
  return cd.data.length > 0
})

// ============================================================================
// 2D Data Builder
// ============================================================================

function build2DData(
  data: DataRow<D, M>[],
  dimensions: D[],
  measures: M[]
): ChartData2D {
  const primaryDim = dimensions[0]
  const legendDim = dimensions[1]

  const categorySet = new Set<string | number>()
  for (const row of data) {
    categorySet.add(row[primaryDim])
  }
  const categories = Array.from(categorySet)

  const series: ChartData2D['series'] = []

  if (legendDim) {
    const measure = measures[0]
    const legendValues = new Set<string | number>()
    for (const row of data) {
      legendValues.add(row[legendDim])
    }

    for (const legendVal of Array.from(legendValues)) {
      const seriesData: number[] = []

      for (const cat of categories) {
        const row = data.find(
          (r) => r[primaryDim] === cat && r[legendDim] === legendVal
        )
        seriesData.push(row ? row[measure] : 0)
      }

      const dimDef = dimensionDefs.value.get(legendDim)
      const color = typeof dimDef === 'object' ? dimDef.bgColor : undefined

      series.push({
        id: `${legendDim}-${legendVal}`,
        label: String(legendVal),
        data: seriesData,
        color,
      })
    }
  } else {
    for (const measure of measures) {
      const seriesData: number[] = []

      for (const cat of categories) {
        const row = data.find((r) => r[primaryDim] === cat)
        seriesData.push(row ? row[measure] : 0)
      }

      series.push({
        id: measure,
        label: meaLabel(measure),
        data: seriesData,
      })
    }
  }

  return {
    mode: '2d',
    categories,
    series,
    xLabel: dimLabel(primaryDim),
    yLabel: measures.length === 1 ? meaLabel(measures[0]) : undefined,
  }
}

// ============================================================================
// 3D Data Builder
// ============================================================================

function build3DData(
  data: DataRow<D, M>[],
  dimensions: D[],
  measure: M
): ChartData3D {
  const dimX = dimensions[0]
  const dimY = dimensions[1]

  const xSet = new Set<string | number>()
  const ySet = new Set<string | number>()

  for (const row of data) {
    xSet.add(row[dimX])
    ySet.add(row[dimY])
  }

  const xCategories = Array.from(xSet)
  const yCategories = Array.from(ySet)

  const data3D: [number, number, number][] = []

  for (const row of data) {
    const xIdx = xCategories.indexOf(row[dimX])
    const yIdx = yCategories.indexOf(row[dimY])
    const value = row[measure]

    if (xIdx !== -1 && yIdx !== -1) {
      data3D.push([xIdx, yIdx, value])
    }
  }

  return {
    mode: '3d',
    xCategories,
    yCategories,
    data: data3D,
    xLabel: dimLabel(dimX),
    yLabel: dimLabel(dimY),
    zLabel: meaLabel(measure),
  }
}
</script>
