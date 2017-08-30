import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import logger from 'redux-logger';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import * as UiStateActions from './actions/uiStateActions';

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  logger,
  reduxImmutableStateInvariant(),
  thunk,
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

window.addEventListener('resize', () => {
    store.dispatch(UiStateActions.screenResize(window.innerHeight, window.innerWidth));
  });
 //Fire a first screenResize to initially fill the uiState
  store.dispatch(UiStateActions.screenResize(window.innerHeight, window.innerWidth));  

export default store