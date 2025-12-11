<template>
  <VChart :option="chartOptions" autoresize style="width:100%; height:100%" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { UnivariateGraphProps, UnivariateDatum } from "../../types/modelGraph"
import type { EChartsOption } from "echarts"

const props = withDefaults(defineProps<UnivariateGraphProps>(), {
  encoding: () => ({}),
})

const isNumericXAxis = computed(() =>
  props.series.every((s) =>
    s.data.every((d: UnivariateDatum) =>
      typeof d.dimension === "number" || Number.isFinite(Number(d.dimension))
    )
  )
)

const categoryValues = computed(() => {
  if (isNumericXAxis.value) return []
  const values = new Set<string>()
  for (const s of props.series) {
    for (const d of s.data) {
      values.add(String(d.dimension))
    }
  }
  return Array.from(values)
})

const chartOptions = computed<EChartsOption>(() => {
  const useCategory = !isNumericXAxis.value
  const showLegend = props.encoding?.showLegend ?? props.series.length > 1

  return {
    tooltip: {},
    legend: showLegend
      ? {
          top: 0,
          type: "scroll",
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
    xAxis: useCategory
      ? {
          type: "category",
          data: categoryValues.value,
          name: props.axes?.x?.label,
        }
      : {
          type: props.axes?.x?.type ?? "value",
          name: props.axes?.x?.label,
        },
    yAxis: {
      type: props.axes?.y?.type ?? "value",
      name: props.axes?.y?.label,
      splitLine: {
        lineStyle: {
          type: "dashed",
          opacity: 0.5,
        },
      },
    },
    series: props.series.map((s) => ({
      type: "scatter",
      name: s.label,
      data: s.data.map((d) => [
        useCategory ? String(d.dimension) : Number(d.dimension),
        d.value,
      ]),
    })),
  }
})
</script>