<template>
  <VChart :option="chartOptions" autoresize style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData3D, VisualEncoding } from '../../types/chart'

// ECharts GL types
interface EChartsGLOption {
  tooltip?: object
  visualMap?: object
  xAxis3D?: object
  yAxis3D?: object
  zAxis3D?: object
  grid3D?: object
  series?: object[]
}

const props = withDefaults(
  defineProps<{
    chartData: ChartData3D
    encoding?: VisualEncoding
  }>(),
  {
    encoding: () => ({}),
  }
)

const maxValue = computed(() => {
  let max = 0
  for (const [, , value] of props.chartData.data) {
    if (value > max) max = value
  }
  return max
})

const chartOptions = computed<EChartsGLOption>(() => {
  const { xCategories, yCategories, data, xLabel, yLabel, zLabel } = props.chartData

  const defaultColors = [
    '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
    '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026',
  ]

  const colors = props.encoding?.colorScale?.colors ?? defaultColors

  return {
    tooltip: {},
    visualMap: {
      max: props.encoding?.colorScale?.max ?? maxValue.value,
      inRange: { color: Array.from(colors) },
    },
    xAxis3D: {
      type: 'category',
      data: xCategories,
      name: xLabel,
    },
    yAxis3D: {
      type: 'category',
      data: yCategories,
      name: yLabel,
    },
    zAxis3D: {
      type: 'value',
      name: zLabel,
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      light: {
        main: { intensity: 1.2, shadow: true },
        ambient: { intensity: 0.3 },
      },
    },
    series: [
      {
        type: 'bar3D',
        data: data,
        shading: 'lambert',
      },
    ],
  }
})
</script>