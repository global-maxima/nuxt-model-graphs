<script setup lang="ts">
import { computed, type Component } from "vue"
import LineGraph from "./LineGraph.vue"
import BarGraph from "./BarGraph.vue"
import ScatterPlot from "./ScatterPlot.vue"
import BarGraph3D from "./BarGraph3D.vue"
import type { GraphProps, ChartType } from "../../types/modelGraph"

// Props are generic over the chart type
const props = defineProps<GraphProps<ChartType>>()

const componentMap: Record<ChartType, Component> = {
  lineGraph: LineGraph,
  verticalBarGraph: BarGraph,
  horizontalBarGraph: BarGraph,
  scatterPlot: ScatterPlot,
  areaGraph: LineGraph,
  barGraph3D: BarGraph3D,
  heatmap: BarGraph3D,     // placeholder
  contour: BarGraph3D,     // placeholder
  surface3D: BarGraph3D,   // placeholder
}

const GraphComponent = computed(() => componentMap[props.type])
</script>

<template>
  <component
    :is="GraphComponent"
    :series="series"
    :axes="axes"
    :encoding="encoding"
  />
</template>