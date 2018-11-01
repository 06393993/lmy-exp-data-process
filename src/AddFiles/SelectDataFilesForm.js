import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {
  numOfDataFilesRawSelector,
  uploadedDataFilesNamesSelector,
  canSelectDataFilesGoNextSelector,
  parsingDataFilesSelector,
} from './selectors';
import {
  uploadFiles,
  proceedFromSelectDataFiles,
} from './actions';
import commonStyles from './styles.module.scss';

class SelectDataFilesForm extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = createRef();
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
  }

  handleFileInputChange() {
    const files = this.fileInputRef.current.files;
    this.props.uploadFiles(files);
  }

  render() {
    const {
      numOfFiles,
      fileNames,
      canGoNext,
      proceed,
      parsing,
    } = this.props;
    return (
      <div className={commonStyles.container}>
        <div>
          <input
            multiple
            disabled={parsing}
            style={{ display: 'none' }}
            id="select-data-files-form-file-input"
            type="file"
            ref={this.fileInputRef}
            onChange={this.handleFileInputChange}
          />
          <label htmlFor="select-data-files-form-file-input">
            <Button
              disabled={parsing}
              variant="contained"
              component="span"
              color="primary"
            >
              upload
            </Button>
          </label>
        </div>
        <div>{numOfFiles} file(s) are selected.</div>
        {numOfFiles > 0 && <List>
          {fileNames.map((fileName, i) => (<ListItem key={i}>
            <ListItemText primary={fileName} />
          </ListItem>))}
        </List>}
        <div style={{display: 'flex'}}>
          <div style={{flex: '1'}} />
          <Button
            disabled={!canGoNext || parsing}
            color="primary"
            onClick={() => proceed()}
          >next</Button>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  fileNames: uploadedDataFilesNamesSelector(state),
  numOfFiles: numOfDataFilesRawSelector(state),
  canGoNext: canSelectDataFilesGoNextSelector(state),
  parsing: parsingDataFilesSelector(state),
}), {
  uploadFiles,
  proceed: proceedFromSelectDataFiles,
})(SelectDataFilesForm);
