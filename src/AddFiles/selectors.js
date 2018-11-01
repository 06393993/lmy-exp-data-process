import { createSelector } from 'reselect';
import {
  getFormValues, 
  isValid,
} from 'redux-form';

function addFilesSelector(state) {
  return state.addFiles;
}

export const activeStepSelector = createSelector(
  addFilesSelector,
  ({ activeStep }) => activeStep,
);

export const dataFilesRawSelector = createSelector(
  addFilesSelector,
  ({ dataFilesRaw }) => dataFilesRaw,
);

export const uploadedDataFilesNamesSelector = createSelector(
  dataFilesRawSelector,
  dataFilesRaw => dataFilesRaw.map(({ name }) => name),
);

export const numOfDataFilesRawSelector = createSelector(
  dataFilesRawSelector,
  ({ length }) => length,
);

export const canSelectDataFilesGoNextSelector = createSelector(
  numOfDataFilesRawSelector,
  length => length > 0,
);

export const parsingDataFilesSelector = createSelector(
  addFilesSelector,
  ({ parsingDataFiles }) => parsingDataFiles,
);

export const parsingFilterFilesSelector = createSelector(
  addFilesSelector,
  ({ parsingFilterFile }) => parsingFilterFile,
);

export const dataFilesSelector = createSelector(
  addFilesSelector,
  ({ dataFiles }) => dataFiles,
);

export const filterFileParsedSelector = createSelector(
  addFilesSelector,
  ({ filtersFromFile }) => Array.isArray(filtersFromFile)
    && filtersFromFile.length > 0
);

function matchFiltersToFiles(filters, dataFileNames) {
  return filters.map(({ fileMatch }) => {
    const res = dataFileNames.filter(dataFileName => dataFileName.indexOf(fileMatch) >= 0);
    if(res.length > 0) {
      return res[0];
    }
    return undefined;
  });
}

export const filterListFormInitialValuesSelector = createSelector(
  dataFilesSelector,
  addFilesSelector,
  filterFileParsedSelector,
  (dataFiles, { filtersFromFile }, hasFilters) => hasFilters
  ? matchFiltersToFiles(filtersFromFile, Object.keys(dataFiles))
    .map((fileName, i) => ({
      from: filtersFromFile[i].from,
      to: filtersFromFile[i].to,
      filterOn: 0,
      fileName,
    }))
  : []
);

export const dataFilesNumOfColumnsSelector = createSelector(
  dataFilesSelector,
  dataFiles => {
    const res = {};
    for(let fileName in dataFiles) {
      res[fileName] = dataFiles[fileName].content
        .map(row => row.length)
        .reduce((acc, cur) => Math.max(acc, cur), 0);
    }
    return res;
  }
);

export const dataFilesNameSelector = createSelector(
  dataFilesSelector,
  dataFiles => Object.keys(dataFiles),
);

const selectFilterFileFormSelector = getFormValues('addFilesSelectFilterFileForm');

export const selectFilterFileFormFilterListSelector = createSelector(
  selectFilterFileFormSelector,
  (form) => form ? form.filters : [],
);

export const selectFilterFileFormNumOfSelectedRowsSelector = createSelector(
  selectFilterFileFormFilterListSelector,
  dataFilesSelector,
  (filters, dataFiles) => filters.map(({
    filterOn,
    from,
    to,
    fileName,
  }) => {
    if(!fileName) {
      return NaN;
    }
    from = +from || 0;
    to = +to || 0;
    return dataFiles[fileName].content
      .filter(row => row[filterOn] >= from && row[filterOn] <= to)
      .length;
  }),
);

export const selectFilterFileFilesWithoutFiltersSelector = createSelector(
  selectFilterFileFormFilterListSelector,
  dataFilesNameSelector,
  filterFileParsedSelector,
  (filters, files, hasFilters) => hasFilters
    ? files.filter(file => filters.findIndex(filter => filter.fileName === file) < 0)
    : [],
);

export const canSelectFilterFileGoNextSelector = createSelector(
  filterFileParsedSelector,
  isValid('addFilesSelectFilterFileForm'),
  (parsed, formValid) => parsed && formValid,
);

export const reviewFilesSelector = createSelector(
  addFilesSelector,
  ({ reviewFiles }) => reviewFiles,
);

export const reviewFormSelector = getFormValues('addFilesReviewForm');
