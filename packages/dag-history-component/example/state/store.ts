import * as redux from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || redux.compose;
const createStoreWithMiddleware = composeEnhancers(
  redux.applyMiddleware(thunk),
  redux.applyMiddleware(routerMiddleware(hashHistory)),
)(redux.createStore);

export default createStoreWithMiddleware(reducers);
