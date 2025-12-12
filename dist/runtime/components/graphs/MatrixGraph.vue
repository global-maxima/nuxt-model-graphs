<template>
  <VChart :option="chartOptions" autoresize style="width: 100%; height: 100%" />
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  chartData: { type: Object, required: true },
  encoding: { type: Object, required: false, default: () => ({}) }
});
const valueDomain = computed(() => {
  const values = props.chartData.data.map(([, , v]) => v);
  if (values.length === 0) return { min: 0, max: 0 };
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
});
const showCellLabels = computed(
  () => props.chartData.xCategories.length <= 10 
);
const chartOptions = computed(() => {
  const { xCategories, yCategories, data, xLabel, yLabel, zLabel } = props.chartData;
  const colors = props.encoding?.colorScale?.colors;
  const min = props.encoding?.colorScale?.min ?? valueDomain.value.min;
  const max = props.encoding?.colorScale?.max ?? valueDomain.value.max;
  const hasFlatRange = min === max;
  const defaultColors = [
    "#313695",
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
    "#a50026"
  ];
  return {
    tooltip: {
      position: "top"
    },
    grid: {
      top: 64,
      left: 72,
      right: 24,
      bottom: 64
    },
    xAxis: {
      type: "category",
      data: xCategories,
      name: xLabel,
      nameLocation: "center",
      nameGap: 30,
      splitArea: { show: true }
    },
    yAxis: {
      type: "category",
      data: yCategories,
      name: yLabel,
      nameLocation: "center",
      nameGap: 50,
      splitArea: { show: true }
    },
    visualMap: {
      type: "continuous",
      min: hasFlatRange ? min - 1 : min,
      max: hasFlatRange ? max + 1 : max,
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: 8,
      inRange: { color: colors ?? defaultColors },
      text: zLabel ? [zLabel, ""] : void 0
    },
    series: [
      {
        type: "heatmap",
        data,
        label: {
          show: showCellLabels.value,
          formatter: (params) => {
            const v = Array.isArray(params.value) ? params.value[2] : null;
            return typeof v === "number" ? v.toFixed(2) : v ?? "";
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.35)"
          }
        }
      }
    ]
  };
});
</script>
