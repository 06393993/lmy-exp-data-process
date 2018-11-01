import React, { Component, createRef, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import WarningIcon from '@material-ui/icons/Warning';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select } from 'redux-form-material-ui';

import {
  parsingFilterFilesSelector,
  filterListFormInitialValuesSelector,
  filterFileParsedSelector,
  dataFilesNumOfColumnsSelector,
  dataFilesNameSelector,
  selectFilterFileFormNumOfSelectedRowsSelector,
  selectFilterFileFilesWithoutFiltersSelector,
  canSelectFilterFileGoNextSelector,
} from './selectors';
import {
  uploadFilterFile,
  filterListChangeFilterOnAccordingToFileChange,
  proceedFromSelectFilterFile,
} from './actions';
import commonStyles from './styles.module.scss';
import styles from './SelectFilterFileForm.module.scss';

function fromToInputValidator(value) {
  if(value === "" || value === null || typeof value === "undefined") {
    return "required";
  }
  if(isNaN(+value)) {
    return "numbers only";
  }
  return undefined;
}

function numbersNormalizer(nextValue, value) {
  if(nextValue === "") {
    return nextValue;
  }
  if(isNaN(+nextValue)) {
    return value;
  }
  return nextValue;
}

function renderTextFieldInTableCell({ input, meta, ...rest }) {
  return (
    <FormControl error={!!meta.error}>
      <Input {...input} {...rest}/>
      {meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}

class FilterList extends Component {
  handleFileChange(i, nextFileName) {
    this.props.changeFilterOnAccordingToFileChange(i, nextFileName);
  }
  render() {
    const {
      fields,
      dataFilesNumOfColumns,
      dataFilesNames,
      numOfSelectedRows,
    } = this.props;
    const tableCellClasses= {
      paddingDense: styles.filterListTableCellPaddingDense,
    };
    const tableCellControlClasses = {
      root: styles.filterListTableCellControls,
    };
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="none">
              <span style={{ visibility: 'hidden' }}>
                <WarningIcon/>
              </span>
            </TableCell>
            <TableCell>from</TableCell>
            <TableCell>to</TableCell>
            <TableCell>filter on</TableCell>
            <TableCell>file</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((namePrefix, i) => (
            <TableRow key={namePrefix}>
              <TableCell padding="none">
                {numOfSelectedRows[i] === 0 &&
                  <Tooltip title="no data is selected with this filter">
                    <WarningIcon/>
                  </Tooltip>
                }
              </TableCell>
              <TableCell padding="dense" classes={tableCellClasses}>
                <Field
                  name={`${namePrefix}.from`} 
                  component={renderTextFieldInTableCell}
                  placeholder="from"
                  classes={tableCellControlClasses}
                  validate={fromToInputValidator}
                  normalize={numbersNormalizer}
                />
              </TableCell>
              <TableCell padding="dense" classes={tableCellClasses}>
                <Field
                  name={`${namePrefix}.to`} 
                  component={renderTextFieldInTableCell}
                  placeholder="to"
                  classes={tableCellControlClasses}
                  validate={fromToInputValidator}
                  normalize={numbersNormalizer}
                />
              </TableCell>
              <TableCell padding="dense" classes={tableCellClasses}>
                {fields.get(i).fileName && <Field
                  name={`${namePrefix}.filterOn`}
                  component={Select}
                  classes={tableCellControlClasses}
                >{
                  Array(...Array(dataFilesNumOfColumns[fields.get(i).fileName])).map((_, i) => (
                    <MenuItem key={i} classes={tableCellControlClasses} value={i}>Column #{i}</MenuItem>
                  ))
                }</Field>}
              </TableCell>
              <TableCell padding="dense" calsses={tableCellClasses}>
                <Field
                  name={`${namePrefix}.fileName`}
                  onChange={(_, nextFileName) => this.handleFileChange(i, nextFileName)}
                  component={Select}
                  classes={tableCellControlClasses}
                  style={{ width: "100%" }}
                  displayEmpty
                >
                  <MenuItem value={""} />
                  {dataFilesNames.map(fileName => (
                    <MenuItem key={fileName} value={fileName}>{fileName}</MenuItem>
                  ))}
                </Field>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

const FilterListContainer = connect(state => ({
  dataFilesNumOfColumns: dataFilesNumOfColumnsSelector(state),
  dataFilesNames: dataFilesNameSelector(state),
  numOfSelectedRows: selectFilterFileFormNumOfSelectedRowsSelector(state),
}), {
  changeFilterOnAccordingToFileChange: filterListChangeFilterOnAccordingToFileChange,
})(FilterList);

class SelectFilterFileForm extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = createRef();
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
  }

  handleFileInputChange() {
    const file = this.fileInputRef.current.files[0];
    this.props.uploadFilterFile(file);
  }

  render() {
    const {
      parsing,
      hasFilters,
      filesWithoutFilters,
      reset,
      canGoNext,
      proceed,
    } = this.props;
    return (
      <div className={commonStyles.container}>
        <div>
          <input
            style={{ display: 'none' }}
            id="select-filter-file-form-file-input"
            type="file"
            ref={this.fileInputRef}
            onChange={this.handleFileInputChange}
            disabled={parsing}
          />
          <label htmlFor="select-filter-file-form-file-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={parsing}
            >
              upload
            </Button>
          </label>
        </div>
        {!parsing && hasFilters && (
          <Fragment>
            {filesWithoutFilters.length > 0 && <div>
              You haven't specified filters for the following files: {filesWithoutFilters.join(", ")}.
            </div>}
            <FieldArray name="filters" component={FilterListContainer} />
            <div style={{ display: 'flex' }}>
              <div style={{ flex: '1' }}/>
              <Button
                style={{ marginRight: '8px' }}
                color="secondary"
                onClick={() => reset()}
              >reset</Button>
              <Button
                disabled={!canGoNext}
                color="primary"
                onClick={() => proceed()}
              >next</Button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  parsing: parsingFilterFilesSelector(state),
  hasFilters: filterFileParsedSelector(state),
  initialValues: {
    filters: filterListFormInitialValuesSelector(state),
  },
  filesWithoutFilters: selectFilterFileFilesWithoutFiltersSelector(state),
  canGoNext: canSelectFilterFileGoNextSelector(state),
}), {
  uploadFilterFile,
  proceed: proceedFromSelectFilterFile,
})(reduxForm({
  form: 'addFilesSelectFilterFileForm',
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(SelectFilterFileForm));
