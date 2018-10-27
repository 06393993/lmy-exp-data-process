import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import addFile from './AddFile/reducer';
import editFile from './EditFile/reducer';
import homeUI from './Home/ui-reducer';

export default combineReducers({
  form,
  addFile,
  editFile,
  homeUI,
});
