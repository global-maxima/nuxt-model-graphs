<template>
  <VChart :option="chartOptions" autoresize style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import type { VisualEncoding,ChartData2D } from '../../types/chart'

const props = withDefaults(
  defineProps<{
    chartData: ChartData2D
    encoding?: VisualEncoding
  }>(),
  {
    encoding: () => ({}),
  }
)

const chartOptions = computed<EChartsOption>(() => {
  const { categories, series, xLabel, yLabel } = props.chartData
  const showLegend = props.encoding?.showLegend ?? series.length > 1

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: showLegend
      ? {
          top: 0,
          type: 'scroll',
          textStyle: { fontSize: 11 },
        }
      : undefined,
    grid: {
      top: showLegend ? 36 : 16,
      bottom: 24,
      left: 40,
      right: 8,
      containLabel: true,
    },
    xAxis: {
      type: props.encoding?.xAxis?.type ?? 'category',
      data: categories,
      name: xLabel,
      nameLocation: 'center',
      nameGap: 25,
    },
    yAxis: {
      type: props.encoding?.yAxis?.type ?? 'value',
      name: yLabel,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.5,
        },
      },
    },
    series: series.map((s) => ({
      type: 'bar',
      name: s.label,
      data: s.data,
      itemStyle: s.color ? { color: s.color } : undefined,
    })),
  }
})
</script>