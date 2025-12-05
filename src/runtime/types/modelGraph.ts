export type Measure = "count" | "sum"
export type Dimension = "scheduleWeek" | "observationWeek"

export interface ModelGraphProps {
  measures: Measure[]
  xAxis: Dimension
  yAxis: Dimension
  filterDims?: Dimension[]
  legendDim?: Dimension
}

export type AvailableGraphType =
  | "lineGraph"
  | "verticalBarGraph"
  | "scatterPlot"

export interface DataPoint {
  x: string | number
  y: number
  [key: string]: unknown
}

export type DataSeries = {
  id: string
  label: string
  data: DataPoint[]
}
