<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  axes: { type: Object, required: false },
  series: { type: Array, required: true },
  encoding: { type: Object, required: false, default: () => ({}) }
});
const isNumericXAxis = computed(
  () => props.series.every(
    (s) => s.data.every(
      (d) => typeof d.dimension === "number" || Number.isFinite(Number(d.dimension))
    )
  )
);
const categoryValues = computed(() => {
  if (isNumericXAxis.value) return [];
  const values = /* @__PURE__ */ new Set();
  for (const s of props.series) {
    for (const d of s.data) {
      values.add(String(d.dimension));
    }
  }
  return Array.from(values);
});
const chartOptions = computed(() => {
  const useCategory = !isNumericXAxis.value;
  const showLegend = props.encoding?.showLegend ?? props.series.length > 1;
  return {
    tooltip: {},
    legend: showLegend ? {
      top: 0,
      type: "scroll",
      textStyle: { fontSize: 11 }
    } : void 0,
    grid: {
      top: showLegend ? 36 : 16,
      bottom: 24,
      left: 40,
      right: 8,
      containLabel: true
    },
    xAxis: useCategory ? {
      type: "category",
      data: categoryValues.value,
      name: props.axes?.x?.label
    } : {
      type: props.axes?.x?.type ?? "value",
      name: props.axes?.x?.label
    },
    yAxis: {
      type: props.axes?.y?.type ?? "value",
      name: props.axes?.y?.label,
      splitLine: {
        lineStyle: {
          type: "dashed",
          opacity: 0.5
        }
      }
    },
    series: props.series.map((s) => ({
      type: "scatter",
      name: s.label,
      data: s.data.map((d) => [
        useCategory ? String(d.dimension) : Number(d.dimension),
        d.value
      ])
    }))
  };
});
</script>
