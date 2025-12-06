<script setup>
import { computed } from "vue";
import LineGraph from "./LineGraph.vue";
import BarGraph from "./BarGraph.vue";
import ScatterPlot from "./ScatterPlot.vue";
const props = defineProps({
  model: { type: Object, required: true },
  series: { type: Array, required: true },
  type: { type: String, required: true }
});
const GraphComponent = computed(() => {
  switch (props.type) {
    case "lineGraph":
      return LineGraph;
    case "verticalBarGraph":
      return BarGraph;
    case "scatterPlot":
      return ScatterPlot;
    default:
      return LineGraph;
  }
});
</script>

<template>
  <component :is="GraphComponent" :model="model" :series="series" />
</template>
