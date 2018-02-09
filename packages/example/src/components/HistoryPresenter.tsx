import { get } from 'lodash'
import * as React from 'react'
import createHistoryContainer from '@essex/dag-history-component/lib/components/createHistoryContainer'
import { load, save } from '../persister'

const HistoryContainer = createHistoryContainer(
	state => state.app,
	state => state.component,
	state => get(state, 'metadata.source'),
)

const HistoryPresenter: React.StatelessComponent<{}> = () => {
	return (
		<div className="history-viz-container">
			<HistoryContainer
				bookmarksEnabled={true}
				controlBar={{
					onSaveHistory: save,
					onLoadHistory: load,
					onConfirmClear: () => Promise.resolve(true),
				}}
			/>
			<input
				id="pickFileInput"
				type="file"
				name="pickFileInput"
				style={{ display: 'none' }}
			/>
		</div>
	)
}

export default HistoryPresenter
