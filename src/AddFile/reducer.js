import {
  UPLOAD_FILE_START,
  UPLOAD_FILE_DONE,
  ADD_FILE_CLEAN,
} from './actions';

const INIT_STATE = {
  // fileName: 'A_TEST_FILE',
  // content: Array(...Array(200000)).map(
  //   () => Array(...Array(4)).map(() => Math.random() * 100),
  // ),
};

export default function (state = INIT_STATE, action) {
  switch(action.type) {
    case UPLOAD_FILE_START:
      return {
        loading: true,
      };
    case UPLOAD_FILE_DONE:
      const { fileName, content } = action;
      return {
        fileName,
        content,
      };
    case ADD_FILE_CLEAN:
      return {};
    default:
  }
  return state;
}
