import {
  change,
  arrayPush,
} from 'redux-form';

import {
  parseDataFile,
  getColumnMinMax,
} from '../utils';
import {
  dataFilesRawSelector,
  dataFilesNumOfColumnsSelector,
  selectFilterFileFormFilterListSelector,
  dataFilesSelector,
  selectFilterFileFilesWithoutFiltersSelector,
} from './selectors';

export const ADD_FILES_INC_ACTIVE_STEP = 'ADD_FILES_INC_ACTIVE_STEP';
export const ADD_FILES_RESET_ACTIVE_STEP = 'ADD_FILES_RESET_ACTIVE_STEP';
export const ADD_FILES_UPLOAD_DATA_FILES = 'ADD_FILES_UPLOAD_DATA_FILES';
export const ADD_FILES_PARSE_DATA_FILES_INITIATE = 'ADD_FILES_PARSE_DATA_FILES_INITIATE';
export const ADD_FILES_PARSE_DATA_FILES_DONE = 'ADD_FILES_PARSE_DATA_FILES_DONE';
export const ADD_FILES_CLEAN_DATA_FILES_RAW = 'ADD_FILES_CLEAN_DATA_FILES_RAW';
export const ADD_FILES_PARSE_FILTER_FILE_INITIATE = 'ADD_FILES_PARSE_FILTER_FILE_INITIATE';
export const ADD_FILES_PARSE_FILTER_FILE_DONE = 'ADD_FILES_PARSE_FILTER_FILE_DONE';
export const ADD_FILES_CLEAN_FILTER_FILES = 'ADD_FILES_CLEAN_FILTER_FILES';
export const ADD_FILES_SET_REVIEW_FILES = 'ADD_FILES_SET_REVIEW_FILES';
export const ADD_FILES_RESET = 'ADD_FILES_RESET';

function increaseActiveStep() {
  return { type: ADD_FILES_INC_ACTIVE_STEP };
}

export function resetActiveStep() {
  return { type: ADD_FILES_RESET_ACTIVE_STEP };
}

export function uploadFiles(_files) {
  const files = [];
  for(let i = 0; i < _files.length; i++) {
    files.push(_files[i]);
  }
  return {
    type: ADD_FILES_UPLOAD_DATA_FILES,
    files,
  };
}

function parseDataFiles() {
  return (dispatch, getState) => {
    const state = getState();
    const files = dataFilesRawSelector(state);
    dispatch({ type: ADD_FILES_PARSE_DATA_FILES_INITIATE });
    return Promise.all(files.map(file => parseDataFile(file).then(content => ({
      fileName: file.name,
      content,
    }))))
    .then(files => Object.assign({}, ...files.map(file => ({
      [ file.fileName ]: file,
    }))))
    .then(files => dispatch({
      type: ADD_FILES_PARSE_DATA_FILES_DONE,
      files,
    }));
  };
}

export function proceedFromSelectDataFiles() {
  return (dispatch) => {
    dispatch(parseDataFiles())
      .then(() => {
        dispatch(increaseActiveStep());
        dispatch({ type: ADD_FILES_CLEAN_DATA_FILES_RAW });
      });
  };
}

export function uploadFilterFile(file) {
  return dispatch => {
    dispatch({ type: ADD_FILES_PARSE_FILTER_FILE_INITIATE });
    const fr = new FileReader();
    fr.readAsText(file);
    fr.onloadend = () => {
      const rawContent = fr.result;
      const filters = rawContent
        .split('\n')
        .map((line, nrow) => line.trim().split(' ').filter(cell => cell))
        .filter(row => row.length >= 3)
        .map(([ fileMatch, from, to ]) => ({
          fileMatch,
          from: parseFloat(from),
          to: parseFloat(to),
        }))
        .filter(({ from, to }) => !isNaN(from) && !isNaN(to));
      dispatch({
        type: ADD_FILES_PARSE_FILTER_FILE_DONE,
        filters,
      });
    };
  };
}

export function filterListChangeFilterOnAccordingToFileChange(i, nextFileName) {
  return (dispatch, getState) => {
    if(!nextFileName) {
      return;
    }
    const state = getState();
    const nextFileNumOfColumns = dataFilesNumOfColumnsSelector(state)[nextFileName];
    const filterOn = selectFilterFileFormFilterListSelector(state)[i].filterOn;
    if(filterOn < nextFileNumOfColumns) {
      return;
    }
    dispatch(change('addFilesSelectFilterFileForm', `filters[${i}].filterOn`, 0));
  };
}

export function proceedFromSelectFilterFile() {
  return (dispatch, getState) => {
    const state = getState();
    const dataFiles = dataFilesSelector(state);
    const files = [
      ...selectFilterFileFormFilterListSelector(state)
      .filter(({ fileName }) => fileName)
      .map(({
        fileName,
        from,
        to,
        filterOn,
      }) => ({
        fileName,
        filterOn,
        content: dataFiles[fileName].content,
        intervals: [{ from: +from, to: +to }],
      })),
      ...selectFilterFileFilesWithoutFiltersSelector(state).map(fileName => {
        const content = dataFiles[fileName].content;
        const {
          min: from,
          max: to,
        } = getColumnMinMax(content, 0);
        return {
          fileName,
          filterOn: 0,
          content,
          intervals: [{ from, to }],
        };
      }),
    ];
    dispatch({
      type: ADD_FILES_SET_REVIEW_FILES,
      files,
    });
    dispatch({ type: ADD_FILES_CLEAN_FILTER_FILES });
    dispatch(increaseActiveStep());
  };
}

export function submit(files) {
  return dispatch => {
    for(const file of files) {
      dispatch(arrayPush('files', 'files', file));
    }
    dispatch({ type: ADD_FILES_RESET });
  }
}
