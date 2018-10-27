import {
  getFormValues,
  isValid,
} from 'redux-form';

import { createFileFormSelectors } from '../selectors';

export function fileSelector(state) {
  return state.addFile;
}

export const formSelector = getFormValues('addFileForm');

export const isFormValid = isValid('addFileForm');

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
