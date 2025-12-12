interface DimensionConfig<D extends string = string> {
    readonly id: D;
    readonly label?: string;
    readonly bgColor?: string;
    readonly sortOrder?: 'asc' | 'desc' | 'none';
}
interface MeasureConfig<M extends string = string> {
    readonly id: M;
    readonly label?: string;
    readonly axis?: 'primary' | 'secondary';
    readonly format?: (value: number) => string;
}
type DimensionDef<D extends string = string> = D | DimensionConfig<D>;
type MeasureDef<M extends string = string> = M | MeasureConfig<M>;
declare function getDimensionId<D extends string>(def: DimensionDef<D>): D;
declare function getMeasureId<M extends string>(def: MeasureDef<M>): M;
declare function getDimensionLabel<D extends string>(def: DimensionDef<D>): string;
declare function getMeasureLabel<M extends string>(def: MeasureDef<M>): string;
type DataRow<D extends string, M extends string> = Record<D, string | number> & Record<M, number>;
interface ChartSchema<D extends string, M extends string> {
    readonly dimensions: DimensionDef<D>[];
    readonly measures: MeasureDef<M>[];
}
interface ChartSelection<D extends string, M extends string> {
    readonly dimensions: D[];
    readonly measures: M[];
}
type GraphKind = 'line' | 'bar' | 'scatter' | 'area' | 'bar3d' | 'matrix';
declare function getAvailableGraphKinds(dimCount: number, measureCount: number): GraphKind[];
interface ColorScale {
    readonly type: 'sequential' | 'diverging' | 'categorical';
    readonly colors?: string[];
    readonly min?: number;
    readonly max?: number;
}
interface AxisConfig {
    readonly type?: 'category' | 'value' | 'time' | 'log';
    readonly label?: string;
    readonly min?: number;
    readonly max?: number;
}
interface VisualEncoding {
    readonly showLegend?: boolean;
    readonly colorScale?: ColorScale;
    readonly xAxis?: AxisConfig;
    readonly yAxis?: AxisConfig;
    readonly zAxis?: AxisConfig;
}
interface ChartProps<D extends string, M extends string> {
    readonly data: DataRow<D, M>[];
    readonly schema: ChartSchema<D, M>;
    readonly selection: ChartSelection<D, M>;
    readonly graphKind: GraphKind;
    readonly encoding?: VisualEncoding;
}
interface ChartSeries2D {
    readonly id: string;
    readonly label: string;
    readonly data: number[];
    readonly color?: string;
}
interface ChartData2D {
    readonly mode: '2d';
    readonly categories: (string | number)[];
    readonly series: ChartSeries2D[];
    readonly xLabel?: string;
    readonly yLabel?: string;
}
interface ChartData3D {
    readonly mode: '3d';
    readonly xCategories: (string | number)[];
    readonly yCategories: (string | number)[];
    readonly data: [number, number, number][];
    readonly xLabel?: string;
    readonly yLabel?: string;
    readonly zLabel?: string;
}
type ChartData = ChartData2D | ChartData3D;
export type { DimensionConfig, MeasureConfig, DimensionDef, MeasureDef, DataRow, ChartSchema, ChartSelection, GraphKind, ColorScale, AxisConfig, VisualEncoding, ChartProps, ChartSeries2D, ChartData2D, ChartData3D, ChartData, };
export { getDimensionId, getMeasureId, getDimensionLabel, getMeasureLabel, getAvailableGraphKinds, };
