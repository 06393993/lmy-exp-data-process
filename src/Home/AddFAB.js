import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Zoom from '@material-ui/core/Zoom';
import Slide from '@material-ui/core/Slide';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import {
  expandAddFAB,
  collapseAddFAB,
} from './actions';
import {
  addFABCollapsedSelector,
} from './selectors';

function AddFAB({
  history,
  collapsed,
  expandAddFAB,
  collapseAddFAB,
}) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      right: '24px',
      zIndex: '100',
      display: 'flex',
    }}>
      <div style={{ position: "absolute", bottom: '0', right: '0', }}>
        <Zoom in={!collapsed}>
          <Button
            variant="fab"
            color="primary"
            onClick={() => expandAddFAB()}
          ><AddIcon /></Button>
        </Zoom>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
      }}>
        <Zoom in={collapsed}>
          <Button
            variant="fab"
            color="secondary"
            onClick={() => collapseAddFAB()}
          ><CloseIcon /></Button>
        </Zoom>
        <div style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          paddingBottom: '52px',
          paddingLeft: '8px',
          paddingRight: '8px',
          marginBottom: '-28px',
          overflow: 'hidden',
        }}>
          <Slide in={collapsed} direction="up">
            <Button
              variant="fab"
              mini
              color="primary"
              onClick={() => {
                history.push('/add');
                collapseAddFAB();
              }}
            ><InsertDriveFileIcon /></Button>
          </Slide>
          <Slide in={collapsed} direction="up">
            <Button
              variant="fab"
              mini
              color="primary"
              style={{ marginBottom: '24px' }}
              onClick={() => {
                history.push('/add-many');
                collapseAddFAB();
              }}
            ><FileCopyIcon /></Button>
          </Slide>
        </div>
      </div>
    </div>
  );
}

export default connect(state => ({
  collapsed: addFABCollapsedSelector(state),
}), {
  expandAddFAB,
  collapseAddFAB,
})(withRouter(AddFAB));
