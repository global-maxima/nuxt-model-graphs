<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  model: { type: Object, required: true },
  series: { type: Array, required: true }
});
const chartOptions = computed(() => ({
  tooltip: {},
  xAxis: {
    type: "category",
    data: props.series[0]?.data.map((point) => point.x)
  },
  yAxis: {
    type: "value"
  },
  series: props.series.map((s) => ({
    type: "line",
    name: s.label,
    data: s.data.map((p) => p.y)
  }))
}));
</script>
