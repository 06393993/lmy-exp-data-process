import { createSelector } from 'reselect';
import { getColumnMinMax } from './utils';

export function createFileFormSelectors(fileSelector, formSelector, isFormValidSelector) {
  const fileNameSelector = createSelector(
    fileSelector,
    ({ fileName }) => fileName,
  );

  const contentSelector = createSelector(
    fileSelector,
    ({ content }) => content,
  );
  
  const contentSampleSelector = createSelector(
    contentSelector,
    content => content.slice(0, 10),
  );

  const numOfColumnsSelector = createSelector(
    contentSelector,
    content => content.map(row => row.length).reduce((acc, cur) => Math.max(acc, cur), -Infinity),
  );

  const filterOnSelector = createSelector(
    formSelector,
    (form) => {
      if(!form) {
        return 0;
      }
      return form.filterOn || 0;
    }
  );

  const filterColumnMinMaxSelector = createSelector(
    contentSelector,
    filterOnSelector,
    getColumnMinMax,
  );

  const intervalsSelector = createSelector(
    formSelector,
    form => (form || {}).intervals || [],
  );

  const selectedRowsSelector = createSelector(
    contentSelector,
    filterOnSelector,
    intervalsSelector,
    (content, filterOn, intervals) => content.filter(
      row => intervals.some(interval => interval.from - row[filterOn] <= Number.EPSILON && row[filterOn] - interval.to <= Number.EPSILON)
    ),
  );

  const resultSelector = createSelector(
    selectedRowsSelector,
    numOfColumnsSelector,
    (selectedRows, numOfColumns) => {
      const length = selectedRows.length;
      if(length === 0) {
        return [];
      }
      const sums = Array(...Array(numOfColumns)).map(() => 0);
      return selectedRows.reduce((sums, row) => {
        for(let i = 0; i < sums.length; i++) {
          sums[i] += row[i] || 0;
        }
        return sums;
      }, sums).map(sum => sum / length);
    },
  );

  const canSubmitSelector = createSelector(
    isFormValidSelector,
    selectedRowsSelector,
    (valid, selectedRows) => valid && selectedRows.length > 0,
  );

  return {
    fileNameSelector,
    filterOnSelector,
    contentSelector,
    contentSampleSelector,
    numOfColumnsSelector,
    filterColumnMinMaxSelector,
    intervalsSelector,
    selectedRowsSelector,
    resultSelector,
    canSubmitSelector,
  };
}
