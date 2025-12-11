<template>
  <VChart :option="chartOptions" autoresize style="width: 100%; height: 100%" />
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  chartData: { type: Object, required: true },
  encoding: { type: Object, required: false, default: () => ({}) }
});
const isNumericXAxis = computed(
  () => props.chartData.categories.every(
    (c) => typeof c === "number" || Number.isFinite(Number(c))
  )
);
const chartOptions = computed(() => {
  const { categories, series, xLabel, yLabel } = props.chartData;
  const showLegend = props.encoding?.showLegend ?? series.length > 1;
  const useCategory = !isNumericXAxis.value;
  return {
    tooltip: {
      trigger: "item"
    },
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
      data: categories,
      name: xLabel,
      nameLocation: "center",
      nameGap: 25
    } : {
      type: props.encoding?.xAxis?.type ?? "value",
      name: xLabel
    },
    yAxis: {
      type: props.encoding?.yAxis?.type ?? "value",
      name: yLabel,
      splitLine: {
        lineStyle: {
          type: "dashed",
          opacity: 0.5
        }
      }
    },
    series: series.map((s) => ({
      type: "scatter",
      name: s.label,
      data: s.data.map((val, idx) => [
        useCategory ? categories[idx] : Number(categories[idx]),
        val
      ]),
      itemStyle: s.color ? { color: s.color } : void 0
    }))
  };
});
</script>
