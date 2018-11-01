import {
  HOME_UI_SHOW_MENU,
  HOME_UI_HIDE_MENU,
  HOME_UI_EXPAND_ADD_FAB,
  HOME_UI_COLLAPSE_ADD_FAB,
} from './actions';

const INIT_STATE = {
  menuOpen: false,
};
export default function (state = INIT_STATE, action) {
  switch(action.type) {
    case HOME_UI_SHOW_MENU:
      return {
        ...state,
        menuOpen: true,
      };
    case HOME_UI_HIDE_MENU:
      return {
        ...state,
        menuOpen: false,
      };
    case HOME_UI_EXPAND_ADD_FAB:
      return {
        ...state,
        addFABCollpsed: true,
      };
    case HOME_UI_COLLAPSE_ADD_FAB:
      return {
        ...state,
        addFABCollpsed: false,
      };
    default:
  }
  return state;
}
