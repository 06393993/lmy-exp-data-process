import React, { Fragment, createRef, Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import commonStyles from '../styles.module.scss';
import { uploadFile } from './actions';

class ChooseFileForm extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = createRef();
  }

  handleFileInputChange = () => {
    const files = this.fileInputRef.current.files;
    if(files && files[0]) {
      this.props.uploadFile(this.fileInputRef.current.files[0]);
      this.fileInputRef.current.value = "";
    }
  }

  render() {
    const { loading } = this.props;
    return (
      <Fragment>
        <Typography variant="h6" className={commonStyles.subTitle}>
          Choose A File
        </Typography>
        {!loading && (
          <Fragment>
            <input
              style={{ display: 'none' }}
              id="choose-file-form-browse-file-input"
              type="file"
              ref={this.fileInputRef}
              onChange={this.handleFileInputChange}
            />
            <label htmlFor="choose-file-form-browse-file-input">
              <Button variant="contained" component="span" color="primary">upload</Button>
            </label>
          </Fragment>
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={30}/>
            <Typography variant="body1" style={{ paddingLeft: "16px" }}>Loading the file...</Typography>
          </div>
        )}
      </Fragment>
    );
  }
}

export default connect(state => ({
  loading: state.addFile.loading,
}), {
  uploadFile,
})(ChooseFileForm);
