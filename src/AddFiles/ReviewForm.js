import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, FieldArray, isValid } from 'redux-form';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import memoize from 'memoize-one';
import { isEqual as deepEqual } from 'lodash';
import { withRouter } from 'react-router';

import {
  reviewFilesSelector,
  reviewFormSelector,
} from './selectors';
import { submit as saveFiles } from './actions';
import EditFileForm from '../EditFileForm';
import { createFileFormSelectors } from '../selectors';
import { createResetIntervalsByFilterColumn } from '../actions';

class FileList extends Component {
  constructor(props) {
    super(props);
    this.renderFromFields = memoize(
      this.renderFromFields.bind(this),
      deepEqual,
    );
  }

  renderFromFields({ fields, onSubmit }) {
    const files = fields.map((name, i) => {
      const fileSelector = state => reviewFilesSelector(state)[i];
      const formSelector = state => reviewFormSelector(state).files[i];
      const {
        fileNameSelector,
        contentSelector,
        contentSampleSelector,
        numOfColumnsSelector,
        filterColumnMinMaxSelector,
        selectedRowsSelector,
        resultSelector,
        filterOnSelector,
        intervalsSelector,
      } = createFileFormSelectors(
        fileSelector,
        formSelector,
      );
      const resetIntervalsByFilterColumn = createResetIntervalsByFilterColumn(
        "addFilesReviewForm",
        formSelector,
        contentSelector,
        filterColumnMinMaxSelector,
        `${name}.`,
      );
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
          numOfSelectedRows: selectedRowsSelector(state).length,
          selectedRowsSample: selectedRowsSelector(state).slice(0, 10),
          result: resultSelector(state),
        };
      }, {
        resetIntervalsByFilterColumn,
      })(EditFileForm);
      return {
        node: (
          <Fragment key={i}>
            <EditFileFormContainer name={name} withoutSubmit/>
            <Divider />
          </Fragment>
        ),
        fileNameSelector,
        resultSelector,
        selectedRowsSelector,
        filterOnSelector,
        intervalsSelector,
        contentSelector,
      };
    });
    const Results = connect(state => ({
      data: files.map(({
        fileNameSelector,
        resultSelector,
      }) => ({
        fileName: fileNameSelector(state),
        result: resultSelector(state),
      }))
    }))(({ data }) => {
      const numOfCols = data
        .map(({ result }) => result.length + 1)
        .reduce((acc, cur) => Math.max(acc, cur), 0);
      return (
        <Table>
          <TableBody>
            {data.map(({ fileName, result }, i) => (
              <TableRow key={i}>
                <TableCell>{fileName}</TableCell>
                {Array(...Array(numOfCols)).map((_, j) => (
                  <TableCell key={j} numeric>{result[j]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    });
    const Submit = connect(state => ({
      canSubmit: files.every(({ selectedRowsSelector }) => selectedRowsSelector(state).length > 0)
        && isValid('addFilesReviewForm')(state),
      data: files.map(({
        fileNameSelector,
        contentSelector,
        filterOnSelector,
        intervalsSelector,
        resultSelector,
      }) => ({
        fileName: fileNameSelector(state),
        content: contentSelector(state),
        filterOn: filterOnSelector(state),
        intervals: intervalsSelector(state),
        averages: resultSelector(state),
      }))
    }))(({ canSubmit, data, onSubmit }) => (
      <Button
        disabled={!canSubmit}
        onClick={() => onSubmit(data)}
      >save</Button>
    ));
    return (
      <div>
        { files.map(({ node }) => node) }
        <div style={{ marginTop: '32px' }}>
          <Typography variant="h6">Results</Typography>
          <div style={{ width: '100%', overflow: 'scroll hidden' }}>
            <Results />
          </div>
        </div>
        <div style={{ marginTop: '32px', display: 'flex' }}>
          <div style={{ flex: '1' }}/>
          <Submit onSubmit={data => onSubmit(data)}/>
        </div>
      </div>
    );
  }

  render() {
    const { fields, onSubmit } = this.props;
    return this.renderFromFields({
      fields: fields.map(name => name),
      onSubmit,
    });
  }
}

class ReviewForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    this.props.saveFiles(data);
    this.props.history.push("/");
  }

  render() {
    return (
      <FieldArray
        name="files"
        component={FileList}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(state => {
  const files = reviewFilesSelector(state)
    .map(({ filterOn, intervals }) => ({
      filterOn,
      intervals,
    }));
  return {
    initialValues: {
      files,
    },
  };
}, {
  saveFiles,
})(reduxForm({
  form: 'addFilesReviewForm',
  enableReinitialize: false,
})(withRouter(ReviewForm)));
