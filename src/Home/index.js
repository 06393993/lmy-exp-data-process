import React, { Component, createRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import * as moment from 'moment';

import {
  showMenu,
  hideMenu,
  clearAll,
} from './actions';
import { filesSelector } from './selectors';
import FileList from './FileList';
import AddFAB from './AddFAB';

class Home extends Component {
  constructor(props) {
    super(props);
    this.menuBtnRef = createRef();
  }

  handleMenuExportClick = () => {
    this.exportAsCSV();
    this.props.hideMenu();
  }

  exportAsCSV = () => {
    const { files } = this.props;
    const csv = Papa.unparse(files.map(({ fileName, averages }) => {
      const res = averages.map(avg => avg.toString())
      res.unshift(fileName);
      return res
    }));
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    const now = moment();
    FileSaver.saveAs(blob, `result-${now.format("YYYY-MM-DD-HH-mm")}-${+now}.csv`);
  }

  handleMenuClearAllClick = () => {
    this.props.clearAll();
    this.props.hideMenu();
  }

  render() {
    const { showMenu, hideMenu, menuOpen } = this.props;
    return (
      <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: '1' }}>
              lmy-exp-data-process
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => showMenu()}
            >
              <MoreVertIcon />
              <div ref={this.menuBtnRef}/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={this.menuBtnRef.current}
          open={menuOpen}
          onClose={() => hideMenu()}
        >
          <MenuItem onClick={this.handleMenuExportClick}>Export</MenuItem>
          <MenuItem onClick={this.handleMenuClearAllClick}>Clear All</MenuItem>
        </Menu>
        <AddFAB />
        <div style={{ flex: '1', overflow: 'hidden scroll' }}>
          <FileList />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  menuOpen: state.homeUI.menuOpen,
  files: filesSelector(state),
}), {
  showMenu,
  hideMenu,
  clearAll,
})(Home);
