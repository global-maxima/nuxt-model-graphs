// src/runtime/types/modelGraph.ts

// ============================================================================
// CORE DATA PRIMITIVES
// ============================================================================

/**
 * A dimension value - the independent variable(s) used for grouping/categorization
 * Can be categorical (string) or continuous (number)
 */
type DimensionValue = string | number

/**
 * A measure value - the dependent variable being quantified
 * Always numeric
 */
type MeasureValue = number

// ============================================================================
// DATUM TYPES - The atomic units of plottable data
// ============================================================================

/**
 * Single independent variable → single dependent variable
 * Used for: line charts, bar charts, scatter plots
 */
interface UnivariateDatum {
  readonly dimension: DimensionValue
  readonly value: MeasureValue
  readonly meta?: Record<string, unknown>  // extensibility for tooltips, etc.
}

/**
 * Two independent variables → single dependent variable
 * Used for: 3D bars, heatmaps, contour plots, bubble charts
 */
interface BivariateDatum {
  readonly dimensionX: DimensionValue
  readonly dimensionY: DimensionValue
  readonly value: MeasureValue
  readonly meta?: Record<string, unknown>
}

/**
 * Union type when you need to accept either (e.g., in utilities)
 */
type Datum = UnivariateDatum | BivariateDatum

// ============================================================================
// TYPE GUARDS
// ============================================================================

const isUnivariateDatum = (d: Datum): d is UnivariateDatum =>
  "dimension" in d && !("dimensionX" in d)

const isBivariateDatum = (d: Datum): d is BivariateDatum =>
  "dimensionX" in d && "dimensionY" in d

// ============================================================================
// SERIES - Collections of data with identity
// ============================================================================

/**
 * Generic series parameterized by datum type
 * The phantom type D ensures homogeneous data within a series
 */
interface DataSeries<D extends Datum> {
  readonly id: string
  readonly label: string
  readonly data: readonly D[]
}

/**
 * Convenience aliases for clarity at call sites
 */
type UnivariateSeries = DataSeries<UnivariateDatum>
type BivariateSeries = DataSeries<BivariateDatum>

// ============================================================================
// AXIS CONFIGURATION
// ============================================================================

type AxisType = "category" | "value" | "time" | "log"

interface AxisConfig {
  readonly type: AxisType
  readonly label?: string
  readonly min?: number
  readonly max?: number
  readonly formatter?: (value: DimensionValue) => string
}

/**
 * Axis requirements vary by dimensionality
 */
interface UnivariateAxes {
  readonly x: AxisConfig
  readonly y: AxisConfig  // This is the value/measure axis
}

interface BivariateAxes {
  readonly x: AxisConfig
  readonly y: AxisConfig  // Second dimension axis
  readonly z: AxisConfig  // This is the value/measure axis
}

// ============================================================================
// CHART TYPE TAXONOMY
// ============================================================================

/**
 * Charts classified by their data dimensionality requirement
 */
type UnivariateChartType =
  | "lineGraph"
  | "verticalBarGraph"
  | "horizontalBarGraph"
  | "scatterPlot"
  | "areaGraph"

type BivariateChartType =
  | "barGraph3D"
  | "heatmap"
  | "contour"
  | "surface3D"

type ChartType = UnivariateChartType | BivariateChartType

// ============================================================================
// TYPE-LEVEL MAPPING: Chart → Datum requirement
// ============================================================================

/**
 * This is the key abstraction: a compile-time mapping from
 * chart type to its required datum type
 */
interface ChartDatumMap {
  // Univariate
  lineGraph: UnivariateDatum
  verticalBarGraph: UnivariateDatum
  horizontalBarGraph: UnivariateDatum
  scatterPlot: UnivariateDatum
  areaGraph: UnivariateDatum
  // Bivariate
  barGraph3D: BivariateDatum
  heatmap: BivariateDatum
  contour: BivariateDatum
  surface3D: BivariateDatum
}

/**
 * Extract datum type for a given chart type
 */
type DatumFor<T extends ChartType> = ChartDatumMap[T]

/**
 * Extract series type for a given chart type
 */
type SeriesFor<T extends ChartType> = DataSeries<DatumFor<T>>

// ============================================================================
// VISUAL ENCODING - How data maps to visual properties
// ============================================================================

interface ColorScale {
  readonly type: "sequential" | "diverging" | "categorical"
  readonly colors?: readonly string[]
  readonly min?: number
  readonly max?: number
}

interface VisualEncoding {
  readonly colorScale?: ColorScale
  readonly showLegend?: boolean
  readonly legendPosition?: "top" | "bottom" | "left" | "right"
}

// ============================================================================
// COMPONENT PROPS - Tied together with generics
// ============================================================================

/**
 * Base props shared by all graph components
 */
interface BaseGraphProps<D extends Datum> {
  readonly series: readonly DataSeries<D>[]
  readonly encoding?: VisualEncoding
}

/**
 * Props for univariate charts
 */
interface UnivariateGraphProps extends BaseGraphProps<UnivariateDatum> {
  readonly axes?: Partial<UnivariateAxes>
}

/**
 * Props for bivariate charts
 */
interface BivariateGraphProps extends BaseGraphProps<BivariateDatum> {
  readonly axes?: Partial<BivariateAxes>
}

/**
 * Fully generic props - used by the renderer which must handle all types
 */
interface GraphProps<T extends ChartType> {
  readonly type: T
  readonly series: readonly SeriesFor<T>[]
  readonly axes?: T extends UnivariateChartType
  ? Partial<UnivariateAxes>
  : Partial<BivariateAxes>
  readonly encoding?: VisualEncoding
}

// ============================================================================
// DATA BINDING - Connecting to data sources
// ============================================================================

/**
 * Describes how to extract graph data from a tabular data source
 * Generic over the column names for type safety
 */
interface UnivariateBinding<
  TDimension extends string = string,
  TMeasure extends string = string
> {
  readonly dimensionField: TDimension
  readonly valueField: TMeasure
  readonly seriesField?: string  // Optional: split into multiple series by this field
}

interface BivariateBinding<
  TDimensionX extends string = string,
  TDimensionY extends string = string,
  TMeasure extends string = string
> {
  readonly dimensionXField: TDimensionX
  readonly dimensionYField: TDimensionY
  readonly valueField: TMeasure
}

type DataBinding<T extends ChartType> = T extends UnivariateChartType
  ? UnivariateBinding
  : BivariateBinding

// ============================================================================
// FACTORY FUNCTIONS - Ensure valid construction
// ============================================================================

/**
 * Creates a univariate datum with validation
 */
const univariate = (
  dimension: DimensionValue,
  value: MeasureValue,
  meta?: Record<string, unknown>
): UnivariateDatum => ({
  dimension,
  value,
  meta,
})

/**
 * Creates a bivariate datum with validation
 */
const bivariate = (
  dimensionX: DimensionValue,
  dimensionY: DimensionValue,
  value: MeasureValue,
  meta?: Record<string, unknown>
): BivariateDatum => ({
  dimensionX,
  dimensionY,
  value,
  meta,
})

/**
 * Creates a typed series
 */
const series = <D extends Datum> (
  id: string,
  label: string,
  data: D[]
): DataSeries<D> => ({
  id,
  label,
  data,
})

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  // Primitives
  DimensionValue,
  MeasureValue,
  // Data
  UnivariateDatum,
  BivariateDatum,
  Datum,
  DataSeries,
  UnivariateSeries,
  BivariateSeries,
  // Axes
  AxisType,
  AxisConfig,
  UnivariateAxes,
  BivariateAxes,
  // Charts
  UnivariateChartType,
  BivariateChartType,
  ChartType,
  ChartDatumMap,
  DatumFor,
  SeriesFor,
  // Visual
  ColorScale,
  VisualEncoding,
  // Props
  BaseGraphProps,
  UnivariateGraphProps,
  BivariateGraphProps,
  GraphProps,
  // Binding
  UnivariateBinding,
  BivariateBinding,
  DataBinding,
}

export {
  // Guards
  isUnivariateDatum,
  isBivariateDatum,
  // Factories
  univariate,
  bivariate,
  series,
}