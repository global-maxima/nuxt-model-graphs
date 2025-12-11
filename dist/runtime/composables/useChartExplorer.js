import { ref, computed, watch } from "vue";
import {
  getDimensionId,
  getMeasureId,
  getAvailableGraphKinds
} from "../types/chart.js";
export function useChartExplorer(schema, options) {
  const dimensionIds = computed(
    () => schema.dimensions.map((d) => getDimensionId(d))
  );
  const measureIds = computed(
    () => schema.measures.map((m) => getMeasureId(m))
  );
  const getDefaultDimensions = () => options?.defaultDimensions ?? (dimensionIds.value[0] ? [dimensionIds.value[0]] : []);
  const getDefaultMeasures = () => options?.defaultMeasures ?? (measureIds.value[0] ? [measureIds.value[0]] : []);
  const selectedDimensions = ref(getDefaultDimensions());
  const selectedMeasures = ref(getDefaultMeasures());
  const availableGraphKinds = computed(
    () => getAvailableGraphKinds(
      selectedDimensions.value.length,
      selectedMeasures.value.length
    )
  );
  const graphKind = ref(
    options?.defaultGraphKind ?? availableGraphKinds.value[0] ?? "line"
  );
  watch(availableGraphKinds, (kinds) => {
    if (kinds.length > 0 && !kinds.includes(graphKind.value)) {
      graphKind.value = kinds[0];
    }
  });
  const selection = computed(() => ({
    dimensions: selectedDimensions.value,
    measures: selectedMeasures.value
  }));
  function selectDimension(id) {
    if (!selectedDimensions.value.includes(id)) {
      selectedDimensions.value = [...selectedDimensions.value, id];
    }
  }
  function deselectDimension(id) {
    selectedDimensions.value = selectedDimensions.value.filter((d) => d !== id);
  }
  function toggleDimension(id) {
    if (selectedDimensions.value.includes(id)) {
      deselectDimension(id);
    } else {
      selectDimension(id);
    }
  }
  function selectMeasure(id) {
    if (!selectedMeasures.value.includes(id)) {
      selectedMeasures.value = [...selectedMeasures.value, id];
    }
  }
  function deselectMeasure(id) {
    selectedMeasures.value = selectedMeasures.value.filter((m) => m !== id);
  }
  function toggleMeasure(id) {
    if (selectedMeasures.value.includes(id)) {
      deselectMeasure(id);
    } else {
      selectMeasure(id);
    }
  }
  function reset() {
    selectedDimensions.value = getDefaultDimensions();
    selectedMeasures.value = getDefaultMeasures();
    graphKind.value = options?.defaultGraphKind ?? availableGraphKinds.value[0] ?? "line";
  }
  return {
    dimensionIds,
    measureIds,
    selectedDimensions,
    selectedMeasures,
    availableGraphKinds,
    graphKind,
    selection,
    selectDimension,
    deselectDimension,
    toggleDimension,
    selectMeasure,
    deselectMeasure,
    toggleMeasure,
    reset
  };
}
