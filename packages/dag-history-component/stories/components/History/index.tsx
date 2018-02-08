import { storiesOf } from '@storybook/react'
import { fromJS } from 'immutable'
import { get } from 'lodash'
import * as React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { Provider } from 'react-redux'
import * as redux from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import createHistoryContainer from '../../../src/components/createHistoryContainer'
const { action } = require('@storybook/addon-actions')

const DragDropContextProvider = require('react-dnd/lib/DragDropContextProvider')
	.default

const Container = createHistoryContainer(
	state => state.app,
	state => state.component,
	state => get(state, 'metadata.source'),
)

function createStore(state: any) {
	// A simple static reducer
	const reducer = () => state

	// If the redux devtools are available, wire into them
	const composeEnhancers =
		// tslint:disable-next-line no-string-literal
		window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || redux.compose
	const logger = createLogger()

	const store: redux.Store<any> = composeEnhancers(
		redux.applyMiddleware(thunk, logger),
	)(redux.createStore)(reducer)
	return store
}

storiesOf('History Injection', module).add('On Bookmarks view with ', () => {
	const store = createStore({
		app: {
			current: {},
			graph: fromJS({
				current: {
					state: '32',
					branch: '0',
				},
				branches: {
					0: {
						latest: '34',
						name: 'Branch 0',
						first: '1',
						committed: '34',
					},
				},
				states: {
					27: {
						id: '27',
						name: 'Initial State',
						branch: '0',
					},
					28: {
						id: '28',
						name: 'Add Empty Visual Container',
						branch: '0',
						parent: '27',
					},
					29: { id: '29', name: 'Add Field', branch: '0', parent: '28' },
					30: {
						id: '30',
						name: 'Update Dimensions',
						branch: '0',
						parent: '29',
					},
					31: {
						id: '31',
						name: 'Update Dimensions',
						branch: '0',
						parent: '30',
					},
					32: { id: '32', name: 'Execute Action', branch: '0', parent: '31' },
					33: { id: '33', name: 'Execute Action', branch: '0', parent: '32' },
					34: { id: '34', name: 'Execute Action', branch: '0', parent: '33' },
				},
				physicalStates: {
					27: {},
					28: {},
					29: {},
					30: {},
					31: {},
					32: {},
					33: {},
					34: {},
				},
				lastStateId: '34',
				lastBranchId: '1',
				stateHash: {},
				chronologicalStates: ['27', '28', '29', '30', '31', '32', '33', '34'],
			}),
		},
		component: {
			bookmarkEdit: { editIndex: 6 },
			dragDrop: {},
			views: {
				mainView: 'storyboarding',
				historyType: 'branched',
				branchContainerExpanded: false,
			},
			playback: { isPlayingBack: false, bookmark: 6, depth: 1 },
			pinnedState: { id: '21' },
			bookmarks: [
				{ name: 'Execute Action', stateId: '25', data: {} },
				{ name: 'Execute Action', stateId: '21', data: {} },
				{ name: 'Initial State', stateId: '19', data: {} },
				{ name: 'Execute Action', stateId: '23', data: {} },
				{ name: 'Execute Action', stateId: '34', data: {} },
				{ name: 'Execute Action', stateId: '33', data: {} },
				{ name: 'Execute Action', stateId: '32', data: {} },
			],
		},
	})
	return (
		<Provider store={store}>
			<DragDropContextProvider backend={HTML5Backend}>
				<Container bookmarksEnabled={true} />
			</DragDropContextProvider>
		</Provider>
	)
})
