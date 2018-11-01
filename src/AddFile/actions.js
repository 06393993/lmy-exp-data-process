import { arrayPush } from 'redux-form';

import {
  formSelector,
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
import {
    parseDataFile,
} from '../utils';

export const UPLOAD_FILE_START = 'UPLOAD_FILE_START';
export const UPLOAD_FILE_DONE = 'UPLOAD_FILE_DONE';
export const ADD_FILE_CLEAN = 'ADD_FILE_CLEAN';

export const resetIntervalsByFilterColumn = createResetIntervalsByFilterColumn(
  'addFileForm',
  formSelector,
  contentSelector,
  filterColumnMinMaxSelector,
);

export function uploadFile(file) {
  return dispatch => {
    dispatch({
      type: UPLOAD_FILE_START,
    });
    parseDataFile(file)
      .then(content => dispatch({
        type: UPLOAD_FILE_DONE,
        fileName: file.name,
        content,
      }));
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
