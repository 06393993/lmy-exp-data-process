import {
  EDIT_FILE_SET,
  EDIT_FILE_CLEAN,
} from './actions';

export default function (state = {}, action) {
  switch(action.type) {
    case EDIT_FILE_SET:
      return {
        ...state,
        file: action.file,
        index: action.index,
      };
    case EDIT_FILE_CLEAN:
      return {};
    default:
  }
  return state;
}
