import {
  ADD_FILES_INC_ACTIVE_STEP,
  ADD_FILES_RESET_ACTIVE_STEP,
  ADD_FILES_UPLOAD_DATA_FILES,
  ADD_FILES_PARSE_DATA_FILES_INITIATE,
  ADD_FILES_PARSE_DATA_FILES_DONE,
  ADD_FILES_CLEAN_DATA_FILES_RAW,
  ADD_FILES_PARSE_FILTER_FILE_INITIATE,
  ADD_FILES_PARSE_FILTER_FILE_DONE,
  ADD_FILES_CLEAN_FILTER_FILES,
  ADD_FILES_SET_REVIEW_FILES,
  ADD_FILES_RESET,
} from './actions';

const INIT_STATE = {
  activeStep: 0,
  parsingDataFiles: false,
  parsingFilterFile: false,
  dataFilesRaw: [],
  dataFiles: {},
  // dataFiles: Object.assign({}, ...Array(...Array(10)).map((_, i) => ({
  //   [ `A_TEST_FILE_0${i}` ]: {
  //     fileName: `A_TEST_FILE_0${i}`,
  //     content: Array(...Array(100)).map(
  //       (_, j) => ([
  //         150 + j * 0.002 + i,
  //         ...Array(...Array(i)).map(() => Math.random() * 100)
  //       ]),
  //     ),
  //   },
  // }))),
  filtersFromFile: [],
  reviewFiles: [],
  // reviewFiles: Array(...Array(10)).map((_, i) => ({
  //   fileName: `A_TEST_FILE_${i}`,
  //   content: Array(...Array(100)).map(
  //       () => Array(...Array(4)).map(() => Math.random() * 100),
  //   ),
  //   intervals: Array(...Array(5)).map(() => ({ from: 0, to: 100 })),
  //   filterOn: 0,
  // })),
};

export default function (state = INIT_STATE, action) {
  switch(action.type) {
    case ADD_FILES_INC_ACTIVE_STEP:
      const activeStep = state.activeStep + 1;
      return {
        ...state,
        activeStep,
      };
    case ADD_FILES_RESET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: 0,
      };
    case ADD_FILES_UPLOAD_DATA_FILES:
      return {
        ...state,
        dataFilesRaw: action.files,
      };
    case ADD_FILES_PARSE_DATA_FILES_INITIATE:
      return {
        ...state,
        parsingDataFiles: true,
      };
    case ADD_FILES_PARSE_DATA_FILES_DONE:
      return {
        ...state,
        parsingDataFiles: false,
        dataFiles: action.files,
      };
    case ADD_FILES_CLEAN_DATA_FILES_RAW:
      return {
        ...state,
        dataFilesRaw: INIT_STATE.dataFilesRaw,
      }
    case ADD_FILES_PARSE_FILTER_FILE_INITIATE:
      return {
        ...state,
        parsingFilterFile: true,
      };
    case ADD_FILES_PARSE_FILTER_FILE_DONE:
      return {
        ...state,
        parsingFilterFile: false,
        filtersFromFile: action.filters,
      };
    case ADD_FILES_CLEAN_FILTER_FILES:
      return {
        ...state,
        filtersFromFile: INIT_STATE.filtersFromFile,
      };
    case ADD_FILES_SET_REVIEW_FILES:
      return {
        ...state,
        reviewFiles: action.files,
      };
    case ADD_FILES_RESET:
      return Object.assign({}, INIT_STATE);
    default:
  }
  return state;
}
