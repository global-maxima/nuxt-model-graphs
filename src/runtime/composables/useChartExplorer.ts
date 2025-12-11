import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import type {
  ChartSchema,
  ChartSelection,
  GraphKind,
} from '../types/chart'
import {
  getDimensionId,
  getMeasureId,
  getAvailableGraphKinds,
} from '../types/chart'

interface UseChartExplorerOptions<D extends string, M extends string> {
  defaultDimensions?: D[]
  defaultMeasures?: M[]
  defaultGraphKind?: GraphKind
}

interface UseChartExplorerReturn<D extends string, M extends string> {
  dimensionIds: ComputedRef<D[]>
  measureIds: ComputedRef<M[]>
  selectedDimensions: Ref<D[]>
  selectedMeasures: Ref<M[]>
  availableGraphKinds: ComputedRef<GraphKind[]>
  graphKind: Ref<GraphKind>
  selection: ComputedRef<ChartSelection<D, M>>
  selectDimension: (id: D) => void
  deselectDimension: (id: D) => void
  toggleDimension: (id: D) => void
  selectMeasure: (id: M) => void
  deselectMeasure: (id: M) => void
  toggleMeasure: (id: M) => void
  reset: () => void
}

export function useChartExplorer<D extends string, M extends string> (
  schema: ChartSchema<D, M>,
  options?: UseChartExplorerOptions<D, M>
): UseChartExplorerReturn<D, M> {

  // ──────────────────────────────────────────────────────────────────────────
  // Schema introspection
  // ──────────────────────────────────────────────────────────────────────────

  const dimensionIds = computed<D[]>(() =>
    schema.dimensions.map((d) => getDimensionId(d))
  )

  const measureIds = computed<M[]>(() =>
    schema.measures.map((m) => getMeasureId(m))
  )

  // ──────────────────────────────────────────────────────────────────────────
  // Selection state
  // ──────────────────────────────────────────────────────────────────────────

  const getDefaultDimensions = (): D[] =>
    options?.defaultDimensions ?? (dimensionIds.value[0] ? [dimensionIds.value[0]] : [])

  const getDefaultMeasures = (): M[] =>
    options?.defaultMeasures ?? (measureIds.value[0] ? [measureIds.value[0]] : [])

  const selectedDimensions = ref<D[]>(getDefaultDimensions()) as Ref<D[]>
  const selectedMeasures = ref<M[]>(getDefaultMeasures()) as Ref<M[]>

  // ──────────────────────────────────────────────────────────────────────────
  // Graph kind
  // ──────────────────────────────────────────────────────────────────────────

  const availableGraphKinds = computed<GraphKind[]>(() =>
    getAvailableGraphKinds(
      selectedDimensions.value.length,
      selectedMeasures.value.length
    )
  )

  const graphKind = ref<GraphKind>(
    options?.defaultGraphKind ?? availableGraphKinds.value[0] ?? 'line'
  ) as Ref<GraphKind>

  watch(availableGraphKinds, (kinds) => {
    if (kinds.length > 0 && !kinds.includes(graphKind.value)) {
      graphKind.value = kinds[0]
    }
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Computed selection for renderer
  // ──────────────────────────────────────────────────────────────────────────

  const selection = computed<ChartSelection<D, M>>(() => ({
    dimensions: selectedDimensions.value,
    measures: selectedMeasures.value,
  }))

  // ──────────────────────────────────────────────────────────────────────────
  // Actions
  // ──────────────────────────────────────────────────────────────────────────

  function selectDimension (id: D): void {
    if (!selectedDimensions.value.includes(id)) {
      selectedDimensions.value = [...selectedDimensions.value, id]
    }
  }

  function deselectDimension (id: D): void {
    selectedDimensions.value = selectedDimensions.value.filter((d) => d !== id)
  }

  function toggleDimension (id: D): void {
    if (selectedDimensions.value.includes(id)) {
      deselectDimension(id)
    } else {
      selectDimension(id)
    }
  }

  function selectMeasure (id: M): void {
    if (!selectedMeasures.value.includes(id)) {
      selectedMeasures.value = [...selectedMeasures.value, id]
    }
  }

  function deselectMeasure (id: M): void {
    selectedMeasures.value = selectedMeasures.value.filter((m) => m !== id)
  }

  function toggleMeasure (id: M): void {
    if (selectedMeasures.value.includes(id)) {
      deselectMeasure(id)
    } else {
      selectMeasure(id)
    }
  }

  function reset (): void {
    selectedDimensions.value = getDefaultDimensions()
    selectedMeasures.value = getDefaultMeasures()
    graphKind.value = options?.defaultGraphKind ?? availableGraphKinds.value[0] ?? 'line'
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Return
  // ──────────────────────────────────────────────────────────────────────────

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
    reset,
  }
}