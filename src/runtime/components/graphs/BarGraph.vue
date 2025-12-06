<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { DataSeries, ModelGraphProps } from "../../types/modelGraph"
import type { EChartsOption } from 'echarts'

const props = defineProps<{ model: ModelGraphProps; series: DataSeries[] }>()

const chartOptions = computed<EChartsOption>(() => ({
  tooltip: {},
  grid: {
    top: 16,
    bottom: 24,
    left: 40,
    right: 8,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: props.series[0]?.data.map((point) => point.x),
  },
  yAxis: {
    type: "value", 
    splitLine: {
      lineStyle: {
        type: 'dashed',
        opacity: 0.5,
      },
    },
  },
  series: props.series.map((s) => ({
    type: "bar",
    name: s.label,
    data: s.data.map((p) => p.y),
  })),
}))
</script>
