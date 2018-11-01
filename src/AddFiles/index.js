import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';

import commonStyles from '../styles.module.scss';
import SelectDataFilesForm from './SelectDataFilesForm';
import SelectFilterFileForm from './SelectFilterFileForm';
import ReviewForm from './ReviewForm';
import {
  activeStepSelector,
} from './selectors';

class AddFiles extends Component {
  render() {
    const {
      history,
      activeStep,
    } = this.props;
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
              Add Multiple Files
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={commonStyles.fileFormContainer}>
          <Paper classes={{ root: commonStyles.fileFormBody }}>
            <Stepper activeStep={activeStep}>
              <Step>
                <StepLabel>Select data files</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select filter file</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review</StepLabel>
              </Step>
            </Stepper>
            {[
              <SelectDataFilesForm />,
              <SelectFilterFileForm />,
              <ReviewForm />,
            ][activeStep]}
          </Paper>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  activeStep: activeStepSelector(state),
}))(AddFiles);
