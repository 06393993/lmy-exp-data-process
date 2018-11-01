import React, { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select, TextField } from 'redux-form-material-ui';
import {
  Field,
  FieldArray,
} from 'redux-form';

import styles from './styles.module.scss';
import commonStyles from '../styles.module.scss';

function SimpleDataTable({ data }) {
  return (
    <div style={{ width: '100%', overflow: 'scroll hidden' }}>
      <Table>
        <TableBody>{
          data.map((row, i) => <TableRow hover key={i}>{
            row.map((cell, i) => <TableCell numeric key={i}>{cell}</TableCell>)
          }</TableRow>)
        }</TableBody>
      </Table>
    </div>
  );
}

function numberNormalizer(value, prevValue) {
  if(value === "" || typeof value === "undefined" || value === null) {
    return value;
  }
  if(isNaN(+value)) {
    return prevValue;
  }
  return value;
}

function requireValidator(value) {
  if(value === "" || typeof value === "undefined" || value === null) {
    return "Required";
  }
  return undefined;
}

function Intervals({ fields, defaultFrom, defaultTo, meta }) {
  return (
    <div>
      <ul>{
        fields.map((name, i) => {
          const error = meta.error && meta.error[i];
          return (
            <li key={i} style={{ display: 'flex', width: '100%', marginBottom: '8px' }}>
              <IconButton disabled={fields.length <= 1} style={{ height: '0%', alignSelf: 'center' }} onClick={() => fields.remove(i)}>
                <RemoveIcon/>
              </IconButton>
              <div className={styles.intervalTextField}>
                <FormControl error={error && error.from}>
                  <Field
                    name={`${name}.from`}
                    component={TextField}
                    label="from"
                    normalize={numberNormalizer}
                    validate={requireValidator}
                  />
                  {error && error.from && <FormHelperText>{error.from}</FormHelperText>}
                </FormControl>
              </div>
              <div className={styles.intervalTextField}>
                <FormControl error={error && error.to}>
                  <Field
                    name={`${name}.to`}
                    component={TextField}
                    label="to"
                    normalize={numberNormalizer}
                    validate={requireValidator}
                  />
                  {error && error.to && <FormHelperText>{error.to}</FormHelperText>}
                </FormControl>
              </div>
            </li>
          );
        })
      }</ul>
      <Button variant="contained" color="primary" onClick={() => fields.push({ from: defaultFrom, to: defaultTo, })}>add an interval</Button>
    </div>
  );
}

export default function EditFileForm({
  fileName,
  contentSample,
  numOfColumns,
  intervalsDefaultFrom,
  intervalsDefaultTo,
  selectedRowsSample,
  result,
  numOfSelectedRows,
  canSubmit,

  resetIntervalsByFilterColumn,
  onSubmit,

  withoutSubmit,
  name,
}) {
  const namePrefix = name ? `${name}.` : "";
  return (
    <Fragment>
      <Typography variant="h6" className={commonStyles.subTitle}>
        Choose A File
      </Typography>
      <Typography variant="body1">
        Below are the first 10 lines of data in file <strong>{fileName}</strong>
      </Typography>
      <SimpleDataTable data={contentSample}/>
      <Typography variant="h6" className={commonStyles.subTitle}>
        Select A Column To Be Filtered On
      </Typography>
      <Typography variant="body1">
        Start from Column #0.
      </Typography>
      <Field name={`${namePrefix}filterOn`} component={Select} onChange={(e, newValue) => resetIntervalsByFilterColumn(newValue)}>{
        Array(...Array(numOfColumns)).map((_, i) => (
          <MenuItem key={i} value={i}>Column #{i}</MenuItem>
        ))
      }</Field>
      <Typography variant="h6" className={commonStyles.subTitle}>
        Define The Intervals
      </Typography>
      <FieldArray name={`${namePrefix}intervals`} component={Intervals} defaultFrom={intervalsDefaultFrom} defaultTo={intervalsDefaultTo} />
      <Typography variant="body1">
        {numOfSelectedRows} row(s) of data are selected. Below are the first 10 selected rows.
      </Typography>
      <SimpleDataTable data={selectedRowsSample} />
      <Typography variant="h6" className={commonStyles.subTitle}>
        Result Preview
      </Typography>
      {selectedRowsSample.length > 0 && <SimpleDataTable data={[result]} />}
      {selectedRowsSample.length === 0 && <Typography variant="body1">No data is selected.</Typography>}
      <div style={{ marginTop: "32px", width: "100%", display: "flex", flexDirection: "row-reverse" }}>
        {!withoutSubmit && <Button
          disabled={!canSubmit}
          variant="contained"
          color="primary"
          onClick={() => onSubmit()}
        >save</Button>}
      </div>
    </Fragment>
  );
}
