<script setup lang="ts">
import { computed } from "vue"
import LineGraph from "./LineGraph.vue"
import BarGraph from "./BarGraph.vue"
import ScatterPlot from "./ScatterPlot.vue"
import type {
  ModelGraphProps,
  AvailableGraphType,
  DataSeries,
} from "../../types/modelGraph"

const props = defineProps<{
  model: ModelGraphProps
  series: DataSeries[]
  type: AvailableGraphType
}>()

const GraphComponent = computed(() => {
  switch (props.type) {
    case "lineGraph":
      return LineGraph
    case "verticalBarGraph":
      return BarGraph
    case "scatterPlot":
      return ScatterPlot
    default:
      return LineGraph
  }
})
</script>

<template>
  <component :is="GraphComponent" :model="model" :series="series" />
</template>
