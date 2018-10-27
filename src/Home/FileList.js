import React, { Fragment } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { reduxForm, FieldArray, Field } from 'redux-form';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import styles from './FileList.module.scss';
import { setIthFileToEditFile } from './actions';

function renderIntervals({ input: { value } }) {
  return <span className={styles.fileListItemSecondaryText}>{value.map(({ from, to }) => `${from}-${to}`).join(", ")}</span>
}

function renderAverages({ input: { value } }) {
  return <span className={styles.fileListItemSecondaryText}>{value.join(", ")}</span>
}

function renderFileName({ input: { value } }) {
  return value || "";
}

function FileList({ fields, history, setIthFileToEditFile }) {
  return (
    <List>{
      fields.map((name, i) => (
        <Fragment key={i}>
          <ListItem button onClick={() => {
            setIthFileToEditFile(i);
            history.push('/edit');
          }}>
            <ListItemText primary={<Field name={`${name}.fileName`} component={renderFileName}/>} secondary={
              <span>
                <Field name={`${name}.intervals`} component={renderIntervals} />
                <Field name={`${name}.averages`} component={renderAverages} />
              </span>
            } />
            <ListItemSecondaryAction>
              <IconButton onClick={() => fields.remove(i)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </Fragment>
      ))
    }</List>
  );
}

function FileListContainer(props) {
  return <FieldArray name="files" component={FileList} {...props}/>;
}

export default connect(null, {
  setIthFileToEditFile,
})(reduxForm({
  form: 'files',
  initialValues: { files: [] },
  // initialValues: { files: Array(...Array(10)).map((_, i) => ({
  //   fileName: `A_TEST_FILE_${i}`,
  //   content: Array(...Array(100)).map(
  //       () => Array(...Array(4)).map(() => Math.random() * 100),
  //   ),
  //   intervals: Array(...Array(5)).map(() => ({ from: 0, to: 100 })),
  //   averages: Array(...Array(100)).map(() => 50),
  //   filterOn: 0,
  // })) },
  destroyOnUnmount: false,
})(withRouter(FileListContainer)));
