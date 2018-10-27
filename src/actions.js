import { getFormValues, change } from 'redux-form';
import { getColumnMinMax } from './utils';

export function createResetIntervalsByFilterColumn(
  form,
  contentSelector,
  filterColumnMinMaxSelector,
) {
  return function (filterColumn) {
    return (dispatch, getState) => {
      const state = getState();
      const content =  contentSelector(state);
      const { min: prevDefaultFrom, max: prevDefaultTo } = filterColumnMinMaxSelector(state);
      const { min: defaultFrom, max: defaultTo } = getColumnMinMax(content, filterColumn);
      const prevValues = getFormValues(form)(state);
      const intervals = prevValues.intervals.map(({ from, to }) => ({
        from: Math.abs(from - prevDefaultFrom) < Number.EPSILON ? defaultFrom : from,
        to: Math.abs(to - prevDefaultTo) < Number.EPSILON ? defaultTo : to,
      }));
      dispatch(change(form, 'intervals', intervals));
    }
  };
}
