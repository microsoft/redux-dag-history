import { DagHistoryImpl } from '@essex/redux-dag-history'
import * as Promise from 'bluebird'
import { mount, configure } from 'enzyme'
import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import History from '../../../src/components/History'
import Configuration from '../../../src/state/Configuration'
import { HistoryType, ComponentView } from '../../../src/interfaces'
import * as Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

// It's kind of cheap, but rendering the top-level component
// gives us a lot of baseline statement test-coverage
describe('The History Component', () => {
	it('can be rendered in branched mode', () => {
		const store = createStore(() => ({}))
		const history = DagHistoryImpl.createHistory({}, new Configuration())
		const rendered = mount(
			<Provider store={store}>
				<History
					onSelectMainView={() => ({})}
					bookmarksEnabled={true}
					bookmarks={[]}
					history={history}
					getSourceFromState={(state: any) => 'test source'}
					historyType={HistoryType.BRANCHED}
					branchContainerExpanded={true}
					mainView={ComponentView.HISTORY}
					controlBar={{
						onConfirmClear: () => Promise.resolve(true),
						onLoadHistory: () => Promise.resolve({}),
						onSaveHistory: () => Promise.resolve(true),
					}}
				/>
			</Provider>,
		)
		expect(rendered).toBeDefined()
	})

	it('can be rendered in chronological mode', () => {
		const store = createStore(() => ({}))
		const history = dagHistory.createHistory({}, new Configuration())
		const rendered = mount(
			<Provider store={store}>
				<History
					onSelectMainView={() => ({})}
					bookmarksEnabled={true}
					history={history}
					bookmarks={[]}
					getSourceFromState={(state: any) => 'test source'}
					historyType={HistoryType.CHRONOLOGICAL}
					mainView={ComponentView.HISTORY}
					controlBar={{
						onConfirmClear: () => Promise.resolve(true),
						onLoadHistory: () => Promise.resolve({}),
						onSaveHistory: () => Promise.resolve(true),
					}}
				/>
			</Provider>,
		)
		expect(rendered).toBeDefined()
	})

	xit('can be rendered in storyboarding mode', () => {
		const store = createStore(() => ({}))
		const history = dagHistory.createHistory({}, new Configuration())
		const rendered = mount(
			<Provider store={store}>
				<History
					onSelectMainView={() => ({})}
					bookmarksEnabled={true}
					history={history}
					bookmarks={[]}
					getSourceFromState={(state: any) => 'test source'}
					historyType={HistoryType.CHRONOLOGICAL}
					mainView={ComponentView.STORYBOARDING}
					controlBar={{
						onConfirmClear: () => Promise.resolve(true),
						onLoadHistory: () => Promise.resolve({}),
						onSaveHistory: () => Promise.resolve(true),
					}}
				/>
			</Provider>,
		)
		expect(rendered).toBeDefined()
	})

	xit('can be rendered in playback mode', () => {
		const store = createStore(() => ({}))
		const history = dagHistory.createHistory({}, new Configuration())

		const rendered = mount(
			<Provider store={store}>
				<History
					onSelectMainView={() => ({})}
					bookmarksEnabled={true}
					bookmarks={[]}
					history={
						{
							...history,
							bookmarkPlaybackIndex: 0,
							bookmarks: [
								{
									stateId: 1,
									name: 'a thing happened',
									data: {
										annotation: 'welp',
									},
								},
							],
						} as any
					}
					getSourceFromState={(state: any) => 'test source'}
					historyType={HistoryType.BRANCHED}
					mainView={ComponentView.STORYBOARDING}
					controlBar={{
						onConfirmClear: () => Promise.resolve(true),
						onLoadHistory: () => Promise.resolve({}),
						onSaveHistory: () => Promise.resolve(true),
					}}
				/>
			</Provider>,
		)
		expect(rendered).toBeDefined()
	})
})
