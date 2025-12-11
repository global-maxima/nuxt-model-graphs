import { type Ref, type ComputedRef } from 'vue';
import type { ChartSchema, ChartSelection, GraphKind } from '../types/chart.js';
interface UseChartExplorerOptions<D extends string, M extends string> {
    defaultDimensions?: D[];
    defaultMeasures?: M[];
    defaultGraphKind?: GraphKind;
}
interface UseChartExplorerReturn<D extends string, M extends string> {
    dimensionIds: ComputedRef<D[]>;
    measureIds: ComputedRef<M[]>;
    selectedDimensions: Ref<D[]>;
    selectedMeasures: Ref<M[]>;
    availableGraphKinds: ComputedRef<GraphKind[]>;
    graphKind: Ref<GraphKind>;
    selection: ComputedRef<ChartSelection<D, M>>;
    selectDimension: (id: D) => void;
    deselectDimension: (id: D) => void;
    toggleDimension: (id: D) => void;
    selectMeasure: (id: M) => void;
    deselectMeasure: (id: M) => void;
    toggleMeasure: (id: M) => void;
    reset: () => void;
}
export declare function useChartExplorer<D extends string, M extends string>(schema: ChartSchema<D, M>, options?: UseChartExplorerOptions<D, M>): UseChartExplorerReturn<D, M>;
export {};
