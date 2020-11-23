/* eslint-disable no-underscore-dangle */

import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as analyticsMiddleware } from '@carvana/analytics';
import configs from './configs';
import rootReducer from './rootReducer';
import initialState from './initialState';

const enhancers = [];
const middleware = [
  thunk,
  analyticsMiddleware(configs)
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(
    createLogger({
      level: 'info',
      collapsed: true
    })
  );
}

let preloadedState;
if (typeof window !== 'undefined') {
  preloadedState = window.__PRELOADED_STATE__;
  if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ === 'function') {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export default createStore(
  rootReducer,
  preloadedState || initialState,
  composedEnhancers
);
