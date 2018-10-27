import { createSelector } from 'reselect';
import {
  getFormValues,
  isValid,
} from 'redux-form';

import { createFileFormSelectors } from '../selectors';

export function fileSelector(state) {
  return state.editFile.file;
}

export const formSelector = getFormValues('editFileForm');

export const isFormValid = isValid('editFileForm');

const {
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
} = createFileFormSelectors(
  fileSelector,
  formSelector,
  isFormValid,
);

export {
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

export const originalFilterOnSelector = createSelector(
  fileSelector,
  ({ filterOn }) => filterOn,
);

export const originalIntervalsSelector = createSelector(
  fileSelector,
  ({ intervals }) => intervals,
);
