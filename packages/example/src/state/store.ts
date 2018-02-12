import * as redux from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const composeEnhancers =
	// tslint:disable-next-line no-string-literal
	(window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || redux.compose
const createStoreWithMiddleware = composeEnhancers(
	redux.applyMiddleware(thunk),
)(redux.createStore)

export default createStoreWithMiddleware(reducers)
