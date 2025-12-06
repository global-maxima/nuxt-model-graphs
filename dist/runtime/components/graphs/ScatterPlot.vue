<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup>
import { computed } from "vue";
import { EChartsOption } from "echarts";
const props = defineProps({
  model: { type: Object, required: true },
  series: { type: Array, required: true }
});
const isNumericXAxis = computed(
  () => props.series.every(
    (s) => s.data.every((p) => typeof p.x === "number" || Number.isFinite(Number(p.x)))
  )
);
const categoryValues = computed(() => {
  if (isNumericXAxis.value) return [];
  const values = /* @__PURE__ */ new Set();
  props.series.forEach((s) => {
    s.data.forEach((p) => values.add(String(p.x)));
  });
  return Array.from(values);
});
const chartOptions = computed(() => {
  const useCategory = !isNumericXAxis.value;
  return {
    tooltip: {},
    xAxis: useCategory ? { type: "category", data: categoryValues.value } : { type: "value" },
    yAxis: {
      type: "value",
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
      data: s.data.map((p) => [
        useCategory ? String(p.x) : Number(p.x),
        p.y
      ])
    }))
  };
});
</script>
