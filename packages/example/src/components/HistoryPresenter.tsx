import { get } from 'lodash'
import * as React from 'react'
import createHistoryContainer from '../../src/components/createHistoryContainer'
import '../../src/daghistory.scss'
import { IBookmark } from '../../src/interfaces'
import { load, save } from '../persister'

const HistoryContainer = createHistoryContainer(
	state => state.app,
	state => state.component,
	state => get(state, 'metadata.source'),
)

const { PropTypes } = React

const HistoryPresenter: React.StatelessComponent<void> = props => {
	return (
		<div className="history-viz-container">
			<HistoryContainer
				bookmarksEnabled
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
