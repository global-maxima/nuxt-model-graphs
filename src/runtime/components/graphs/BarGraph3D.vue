<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { BivariateGraphProps } from "../../types/modelGraph"
import type { EChartsGLOption } from "../../types/echartsGL"

const props = withDefaults(defineProps<BivariateGraphProps>(), {
  encoding: () => ({}),
})

const axisCategories = computed(() => {
  const xSet = new Set<string | number>()
  const ySet = new Set<string | number>()

  for (const s of props.series) {
    for (const d of s.data) {
      xSet.add(d.dimensionX)
      ySet.add(d.dimensionY)
    }
  }

  return {
    x: Array.from(xSet),
    y: Array.from(ySet),
  }
})

const maxValue = computed(() => {
  let max = 0
  for (const s of props.series) {
    for (const d of s.data) {
      if (d.value > max) max = d.value
    }
  }
  return max
})

const chartOptions = computed<EChartsGLOption>(() => {
  const { x: xCats, y: yCats } = axisCategories.value

  const colors = props.encoding?.colorScale?.colors ?? [
    "#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8",
    "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026",
  ]

  const data3D: [number, number, number][] = []
  for (const s of props.series) {
    for (const d of s.data) {
      data3D.push([
        xCats.indexOf(d.dimensionX),
        yCats.indexOf(d.dimensionY),
        d.value,
      ])
    }
  }

  return {
    tooltip: {},
    visualMap: {
      max: props.encoding?.colorScale?.max ?? maxValue.value,
      inRange: { color: Array.from(colors) },
    },
    xAxis3D: {
      type: "category",
      data: xCats,
      name: props.axes?.x?.label,
    },
    yAxis3D: {
      type: "category",
      data: yCats,
      name: props.axes?.y?.label,
    },
    zAxis3D: {
      type: "value",
      name: props.axes?.z?.label,
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      light: {
        main: { intensity: 1.2, shadow: true },
        ambient: { intensity: 0.3 },
      },
    },
    series: [{
      type: "bar3D",
      data: data3D,
      shading: "lambert",
    }],
  }
})
</script>