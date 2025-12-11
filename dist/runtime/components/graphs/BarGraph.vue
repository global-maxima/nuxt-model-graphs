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
const chartOptions = computed(() => {
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
    xAxis: {
      type: props.axes?.x?.type ?? "category",
      data: props.series[0]?.data.map((d) => d.dimension),
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
      type: "bar",
      name: s.label,
      data: s.data.map((d) => d.value)
    }))
  };
});
</script>
