<script setup>
import { computed } from "vue";
import LineGraph from "./LineGraph.vue";
import BarGraph from "./BarGraph.vue";
import ScatterPlot from "./ScatterPlot.vue";
import BarGraph3D from "./BarGraph3D.vue";
const props = defineProps({
  type: { type: String, required: true },
  series: { type: Array, required: true },
  axes: { type: null, required: false },
  encoding: { type: Object, required: false }
});
const componentMap = {
  lineGraph: LineGraph,
  verticalBarGraph: BarGraph,
  horizontalBarGraph: BarGraph,
  scatterPlot: ScatterPlot,
  areaGraph: LineGraph,
  barGraph3D: BarGraph3D,
  heatmap: BarGraph3D,
  // placeholder
  contour: BarGraph3D,
  // placeholder
  surface3D: BarGraph3D
  // placeholder
};
const GraphComponent = computed(() => componentMap[props.type]);
</script>

<template>
  <component
    :is="GraphComponent"
    :series="series"
    :axes="axes"
    :encoding="encoding"
  />
</template>
