import { getFormValues } from 'redux-form';
import { createSelector } from 'reselect';

export const filesSelector = createSelector(
  getFormValues('files'),
  (filesForm) => filesForm && filesForm.files ? filesForm.files : [],
);

export const addFABCollapsedSelector = state => state.homeUI.addFABCollpsed;
