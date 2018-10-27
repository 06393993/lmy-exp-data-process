export function getColumnMinMax(data, col) {
  const filterColumn = data.map(row => row[col]);
  return {
    min: filterColumn.reduce((acc, cur) => Math.min(acc, cur), Infinity),
    max: filterColumn.reduce((acc, cur) => Math.max(acc, cur), -Infinity),
  };
}
