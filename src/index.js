import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from './js/reducers';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import './index.scss';

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});
const store = createStore(reducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store);

/* eslint-disable react/jsx-no-bind */

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/">
        <IndexRoute getComponent={(location, callback) => {
          require.ensure([], require => {
            callback(null, require('./js/containers/HelloWorld').default);
          }, 'helloword');
        }} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));

/* eslint-enable jsx-no-bind */
