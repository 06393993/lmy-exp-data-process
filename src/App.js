import React, { Component } from 'react';
import { createStore, applyMiddleware, compose, } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import thunk from 'redux-thunk';

import reducer from './reducer';
import Home from './Home';
import AddFile from './AddFile';
import AddFiles from './AddFiles';
import EditFile from './EditFile';

const composeEnhancers = typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <HashRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/add" component={AddFile} />
              <Route exact path="/add-many" component={AddFiles} />
              <Route exact path="/edit" component={EditFile} />
              <Redirect to="/" />
            </Switch>
          </HashRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
