<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup>
import { computed } from "vue";
const props = withDefaults(defineProps({
  model: { type: Object, required: true },
  series: { type: Array, required: true },
  showLegend: { type: Boolean, required: false }
}), {
  showLegend: void 0
});
const chartOptions = computed(() => {
  const shouldShowLegend = props.showLegend ?? (Array.isArray(props.series) && props.series.length > 1);
  return {
    tooltip: {},
    legend: shouldShowLegend ? {
      top: 0,
      type: "scroll",
      textStyle: { fontSize: 11 }
    } : void 0,
    grid: {
      top: shouldShowLegend ? 36 : 16,
      bottom: 24,
      left: 40,
      right: 8,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: props.series[0]?.data.map((point) => point.x)
    },
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
      type: "bar",
      name: s.label,
      data: s.data.map((p) => p.y)
    }))
  };
});
</script>
