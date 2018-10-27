import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import {
  contentSelector,
  contentSampleSelector,
  numOfColumnsSelector,
  filterColumnMinMaxSelector,
  selectedRowsSelector,
  resultSelector,
  canSubmitSelector,
  fileNameSelector,
} from './selectors';
import { getColumnMinMax } from '../utils';
import {
  resetIntervalsByFilterColumn,
  addFileToList,
} from './actions';
import EditFileForm from '../EditFileForm';
import ChooseFileForm from './ChooseFileForm';
import commonStyles from '../styles.module.scss';

const AddFileForm = connect(state => {
  const {
    min: intervalsDefaultFrom,
    max: intervalsDefaultTo,
  } = filterColumnMinMaxSelector(state);
  const content = contentSelector(state);
  const {
    min: initIntervalsDefaultFrom,
    max: initIntervalsDefaultTo,
  } = getColumnMinMax(content, 0);
  return {
    fileName: fileNameSelector(state),
    contentSample: contentSampleSelector(state),
    numOfColumns: numOfColumnsSelector(state),
    intervalsDefaultFrom,
    intervalsDefaultTo,
    initialValues: {
      filterOn: 0,
      intervals: [{
        from: initIntervalsDefaultFrom,
        to: initIntervalsDefaultTo,
      }],
    },
    numOfSelectedRows: selectedRowsSelector(state).length,
    selectedRowsSample: selectedRowsSelector(state).slice(0, 10),
    result: resultSelector(state),
    canSubmit: canSubmitSelector(state),
  };
}, {
  resetIntervalsByFilterColumn,
})(reduxForm({
  form: 'addFileForm',
  enableReinitialize: false,
})(EditFileForm));

function AddFile({ history, content, addFileToList }) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            className={commonStyles.toolbarBackBtn}
            onClick={() => history.goBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Add A File
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={commonStyles.fileFormContainer}>
        <Paper classes={{ root: commonStyles.fileFormBody }}>
          { !content && <ChooseFileForm /> }
          { content && <AddFileForm onSubmit={() => {
            addFileToList();
            history.push('/');
          }} /> }
        </Paper>
      </div>
    </div>
  );
}


export default connect(state => ({
  content: contentSelector(state),
}), {
  addFileToList,
})(AddFile);
