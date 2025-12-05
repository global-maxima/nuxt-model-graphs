<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { DataSeries, ModelGraphProps } from "../../types/modelGraph"

const props = defineProps<{ model: ModelGraphProps; series: DataSeries[] }>()

const chartOptions = computed(() => ({
  tooltip: {},
  xAxis: {
    type: "category",
    data: props.series[0]?.data.map((point) => point.x),
  },
  yAxis: {
    type: "value",
  },
  series: props.series.map((s) => ({
    type: "bar",
    name: s.label,
    data: s.data.map((p) => p.y),
  })),
}))
</script>
