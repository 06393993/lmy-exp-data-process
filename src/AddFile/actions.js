import { arrayPush } from 'redux-form';

import {
  filterColumnMinMaxSelector,
  contentSelector,
  intervalsSelector,
  fileNameSelector,
  resultSelector,
  filterOnSelector,
} from './selectors';
import {
  createResetIntervalsByFilterColumn,
} from '../actions';

export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_DONE = 'UPLOAD_FILE_DONE';
export const ADD_FILE_CLEAN = 'ADD_FILE_CLEAN';

export const resetIntervalsByFilterColumn = createResetIntervalsByFilterColumn(
  'addFileForm',
  contentSelector,
  filterColumnMinMaxSelector,
);

export function uploadFile(file) {
  return dispatch => {
    dispatch({
      type: UPLOAD_FILE_START,
    });
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
      dispatch({
        type: UPLOAD_FILE_DONE,
        fileName: file.name,
        content,
      });
    };
  };
}

export function addFileToList() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(arrayPush(
      'files',
      'files',
      {
        fileName: fileNameSelector(state),
        content: contentSelector(state),
        averages: resultSelector(state),
        intervals: intervalsSelector(state),
        filterOn: filterOnSelector(state),
      },
    ));
  };
}

export function cleanAddFileState() {
  return { type: ADD_FILE_CLEAN };
}
