import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { reduxForm } from 'redux-form';
import { Redirect } from 'react-router';

import {
  contentSampleSelector,
  numOfColumnsSelector,
  filterColumnMinMaxSelector,
  selectedRowsSelector,
  resultSelector,
  canSubmitSelector,
  fileNameSelector,
  originalFilterOnSelector,
  originalIntervalsSelector,
  fileSelector,
} from './selectors';
import commonStyles from '../styles.module.scss';
import EditFileForm from '../EditFileForm';
import {
  resetIntervalsByFilterColumn,
  setFile,
  cleanEditFileState,
} from './actions';

const EditFileFormContainer = connect(state => {
  const {
    min: intervalsDefaultFrom,
    max: intervalsDefaultTo,
  } = filterColumnMinMaxSelector(state);
  return {
    fileName: fileNameSelector(state),
    contentSample: contentSampleSelector(state),
    numOfColumns: numOfColumnsSelector(state),
    intervalsDefaultFrom,
    intervalsDefaultTo,
    initialValues: {
      filterOn: originalFilterOnSelector(state),
      intervals: originalIntervalsSelector(state),
    },
    numOfSelectedRows: selectedRowsSelector(state).length,
    selectedRowsSample: selectedRowsSelector(state).slice(0, 10),
    result: resultSelector(state),
    canSubmit: canSubmitSelector(state),
  };
}, {
  resetIntervalsByFilterColumn,
})(reduxForm({
  form: 'editFileForm',
  enableReinitialize: false,
})(EditFileForm));

class EditFile extends Component {
  componentWillUnmount() {
    this.props.cleanEditFileState();
  }

  render() {
    const { history, setFile, file } = this.props;
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
              Edit A File
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={commonStyles.fileFormContainer}>
          <Paper classes={{ root: commonStyles.fileFormBody }}>
            {file && <EditFileFormContainer onSubmit={() => {
              setFile();
              history.push('/');
            }} />}
            {!file && <Redirect to="/" />}
          </Paper>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  file: fileSelector(state),
}), {
  setFile,
  cleanEditFileState,
})(EditFile);
