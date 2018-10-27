import {
  HOME_UI_SHOW_MENU,
  HOME_UI_HIDE_MENU,
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
    default:
  }
  return state;
}
