import { arrayRemoveAll } from 'redux-form';
import {
  filesSelector,
} from './selectors';
import { setEditFile } from '../EditFile/actions';

export const HOME_UI_SHOW_MENU = 'HOME_UI_SHOW_MENU';
export const HOME_UI_HIDE_MENU = 'HOME_UI_HIDE_MENU';

export function showMenu() {
  return { type: HOME_UI_SHOW_MENU };
}

export function hideMenu() {
  return { type: HOME_UI_HIDE_MENU };
}

export function setIthFileToEditFile(i) {
  return (dispatch, getState) => {
    dispatch(setEditFile(filesSelector(getState())[i], i));
  };
}

export function clearAll() {
  return arrayRemoveAll('files', 'files');
}
