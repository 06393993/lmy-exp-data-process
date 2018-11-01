import { change } from 'redux-form';
import { getColumnMinMax } from './utils';

export function createResetIntervalsByFilterColumn(
  form,
  formSelector,
  contentSelector,
  filterColumnMinMaxSelector,
  namePrefix = "",
) {
  return function (filterColumn) {
    return (dispatch, getState) => {
      const state = getState();
      const content =  contentSelector(state);
      const { min: prevDefaultFrom, max: prevDefaultTo } = filterColumnMinMaxSelector(state);
      const { min: defaultFrom, max: defaultTo } = getColumnMinMax(content, filterColumn);
      const prevValues = formSelector(state);
      const intervals = prevValues.intervals.map(({ from, to }) => ({
        from: Math.abs(from - prevDefaultFrom) < Number.EPSILON ? defaultFrom : from,
        to: Math.abs(to - prevDefaultTo) < Number.EPSILON ? defaultTo : to,
      }));
      dispatch(change(form, `${namePrefix}intervals`, intervals));
    }
  };
}
