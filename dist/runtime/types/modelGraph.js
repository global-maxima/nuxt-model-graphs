const isUnivariateDatum = (d) => "dimension" in d && !("dimensionX" in d);
const isBivariateDatum = (d) => "dimensionX" in d && "dimensionY" in d;
const univariate = (dimension, value, meta) => ({
  dimension,
  value,
  meta
});
const bivariate = (dimensionX, dimensionY, value, meta) => ({
  dimensionX,
  dimensionY,
  value,
  meta
});
const series = (id, label, data) => ({
  id,
  label,
  data
});
export {
  isUnivariateDatum,
  isBivariateDatum,
  univariate,
  bivariate,
  series
};
