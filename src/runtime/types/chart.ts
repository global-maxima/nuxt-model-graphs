// src/runtime/types/chart.ts

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

interface DimensionConfig<D extends string = string> {
  readonly id: D
  readonly label?: string
  readonly bgColor?: string
  readonly sortOrder?: 'asc' | 'desc' | 'none'
}

interface MeasureConfig<M extends string = string> {
  readonly id: M
  readonly label?: string
  readonly axis?: 'primary' | 'secondary'
  readonly format?: (value: number) => string
}

type DimensionDef<D extends string = string> = D | DimensionConfig<D>
type MeasureDef<M extends string = string> = M | MeasureConfig<M>

// ============================================================================
// HELPERS
// ============================================================================

function getDimensionId<D extends string> (def: DimensionDef<D>): D {
  return typeof def === 'string' ? def : def.id
}

function getMeasureId<M extends string> (def: MeasureDef<M>): M {
  return typeof def === 'string' ? def : def.id
}

function getDimensionLabel<D extends string> (def: DimensionDef<D>): string {
  return typeof def === 'string' ? def : (def.label ?? def.id)
}

function getMeasureLabel<M extends string> (def: MeasureDef<M>): string {
  return typeof def === 'string' ? def : (def.label ?? def.id)
}

// ============================================================================
// DATA
// ============================================================================

type DataRow<D extends string, M extends string> = Record<D, string | number> &
  Record<M, number>

// ============================================================================
// SCHEMA
// ============================================================================

interface ChartSchema<D extends string, M extends string> {
  readonly dimensions: DimensionDef<D>[]
  readonly measures: MeasureDef<M>[]
}

// ============================================================================
// SELECTION
// ============================================================================

interface ChartSelection<D extends string, M extends string> {
  readonly dimensions: D[]
  readonly measures: M[]
}

// ============================================================================
// GRAPH KINDS
// ============================================================================

type GraphKind = 'line' | 'bar' | 'scatter' | 'area' | 'bar3d' | 'heatmap'

function getAvailableGraphKinds (
  dimCount: number,
  measureCount: number
): GraphKind[] {
  if (dimCount === 0 || measureCount === 0) return []

  if (dimCount === 1) {
    if (measureCount === 1) return ['line', 'bar', 'scatter', 'area']
    if (measureCount > 1) return ['line', 'bar']
  }

  if (dimCount === 2) {
    if (measureCount === 1) return ['line', 'bar', 'scatter', 'bar3d', 'heatmap']
  }

  return ['bar']
}

// ============================================================================
// VISUAL ENCODING
// ============================================================================

interface ColorScale {
  readonly type: 'sequential' | 'diverging' | 'categorical'
  readonly colors?: string[]
  readonly min?: number
  readonly max?: number
}

interface AxisConfig {
  readonly type?: 'category' | 'value' | 'time' | 'log'
  readonly label?: string
  readonly min?: number
  readonly max?: number
}

interface VisualEncoding {
  readonly showLegend?: boolean
  readonly colorScale?: ColorScale
  readonly xAxis?: AxisConfig
  readonly yAxis?: AxisConfig
  readonly zAxis?: AxisConfig
}

// ============================================================================
// RENDERER PROPS
// ============================================================================

interface ChartProps<D extends string, M extends string> {
  readonly data: DataRow<D, M>[]
  readonly schema: ChartSchema<D, M>
  readonly selection: ChartSelection<D, M>
  readonly graphKind: GraphKind
  readonly encoding?: VisualEncoding
}

// ============================================================================
// INTERNAL CHART DATA (passed to leaf components)
// ============================================================================

interface ChartSeries2D {
  readonly id: string
  readonly label: string
  readonly data: number[]
  readonly color?: string
}

interface ChartData2D {
  readonly mode: '2d'
  readonly categories: (string | number)[]
  readonly series: ChartSeries2D[]
  readonly xLabel?: string
  readonly yLabel?: string
}

interface ChartData3D {
  readonly mode: '3d'
  readonly xCategories: (string | number)[]
  readonly yCategories: (string | number)[]
  readonly data: [number, number, number][]
  readonly xLabel?: string
  readonly yLabel?: string
  readonly zLabel?: string
}

type ChartData = ChartData2D | ChartData3D

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  DimensionConfig,
  MeasureConfig,
  DimensionDef,
  MeasureDef,
  DataRow,
  ChartSchema,
  ChartSelection,
  GraphKind,
  ColorScale,
  AxisConfig,
  VisualEncoding,
  ChartProps,
  ChartSeries2D,
  ChartData2D,
  ChartData3D,
  ChartData,
}

export {
  getDimensionId,
  getMeasureId,
  getDimensionLabel,
  getMeasureLabel,
  getAvailableGraphKinds,
}