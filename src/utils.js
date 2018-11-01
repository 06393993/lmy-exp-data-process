export function getColumnMinMax(data, col) {
  const filterColumn = data.map(row => row[col]);
  return {
    min: filterColumn.reduce((acc, cur) => Math.min(acc, cur), Infinity),
    max: filterColumn.reduce((acc, cur) => Math.max(acc, cur), -Infinity),
  };
}

export function parseDataFile(file) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsText(file);
    fr.onloadend = () => {
      const rawContent = fr.result;
      const content = rawContent
        .split('\n')
        .map((line, nrow) => line.split(' ').filter(cell => cell).map((cell, ncol) => {
          const res = parseFloat(cell);
          if(isNaN(res)) {
            console.log(`invalid cell(${nrow}:${ncol}): ${cell}`);
          }
          return res;
        }))
        .filter(row => row.length > 0);
      resolve(content);
    }
  });
}
