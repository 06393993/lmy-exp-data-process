import { change } from 'redux-form';

import {
  formSelector,
  contentSelector,
  filterColumnMinMaxSelector,
  fileNameSelector,
  resultSelector,
  intervalsSelector,
  filterOnSelector,
} from './selectors';
import {
  createResetIntervalsByFilterColumn,
} from '../actions';

export const EDIT_FILE_SET = 'EDIT_FILE_SET';
export const EDIT_FILE_CLEAN = 'EDIT_FILE_CLEAN';

export function setEditFile(file, index) {
  return {
    type: EDIT_FILE_SET,
    file,
    index,
  };
}

export const resetIntervalsByFilterColumn = createResetIntervalsByFilterColumn(
  'editFileForm',
  formSelector,
  contentSelector,
  filterColumnMinMaxSelector,
);

export function setFile() {
  return (dispatch, getState) => {
    const state = getState();
    const i = state.editFile.index;
    dispatch(change(
      'files',
      `files[${i}]`,
      {
        fileName: fileNameSelector(state),
        content: contentSelector(state),
        averages: resultSelector(state),
        intervals: intervalsSelector(state),
        filterOn: filterOnSelector(state),
      }
    ));
  };
}

export function cleanEditFileState() {
  return { type: EDIT_FILE_CLEAN };
}
