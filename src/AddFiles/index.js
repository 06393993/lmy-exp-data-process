import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import commonStyles from '../styles.module.scss';

export default class AddFiles extends Component {
  render() {
    const { history } = this.props;
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
        <div>Add multiple files.</div>
      </div>
    );
  }
}
