function getDimensionId(def) {
  return typeof def === "string" ? def : def.id;
}
function getMeasureId(def) {
  return typeof def === "string" ? def : def.id;
}
function getDimensionLabel(def) {
  return typeof def === "string" ? def : def.label ?? def.id;
}
function getMeasureLabel(def) {
  return typeof def === "string" ? def : def.label ?? def.id;
}
function getAvailableGraphKinds(dimCount, measureCount) {
  if (dimCount === 0 || measureCount === 0) return [];
  if (dimCount === 1) {
    if (measureCount === 1) return ["line", "bar", "scatter", "area"];
    if (measureCount > 1) return ["line", "bar"];
  }
  if (dimCount === 2) {
    if (measureCount === 1) return ["line", "bar", "scatter", "bar3d", "matrix"];
  }
  return ["bar"];
}
export {
  getDimensionId,
  getMeasureId,
  getDimensionLabel,
  getMeasureLabel,
  getAvailableGraphKinds
};
