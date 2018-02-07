import * as debug from 'debug'
import * as React from 'react'

import './PlaybackPane.scss'

const { PropTypes } = React
import DiscoveryTrail from '../DiscoveryTrail'

const log = debug('dag-history-component:components:PlaybackPane')

export interface IPlaybackPaneProps {
	text: string
	depth: number
	highlight: number
	bookmarkDepth: number
	bookmarkHighlight: number
	bookmarkNumLeadInStates?: number
	onDiscoveryTrailIndexClicked?: Function
}

const PlaybackPane: React.StatelessComponent<IPlaybackPaneProps> = props => {
	const {
		text,
		depth,
		highlight,
		bookmarkDepth,
		bookmarkHighlight,
		bookmarkNumLeadInStates,
		onDiscoveryTrailIndexClicked,
	} = props
	return (
		<div className="playback-pane-container">
			<div className="playback-pane-paged">
				<div className="playback-pane">
					<h3>{text}</h3>
				</div>
				<DiscoveryTrail
					vertical
					fullWidth
					bookmark
					active
					depth={depth - 1}
					highlight={highlight}
				/>
			</div>
			<DiscoveryTrail
				active
				fullWidth
				leadIn={bookmarkNumLeadInStates}
				depth={bookmarkDepth - 1}
				highlight={bookmarkHighlight}
				onIndexClicked={idx => onDiscoveryTrailIndexClicked(idx)}
			/>
		</div>
	)
}

PlaybackPane.propTypes = {
	text: PropTypes.string.isRequired,

	// Props for the slide show
	depth: PropTypes.number.isRequired,
	highlight: PropTypes.number.isRequired,

	// Props for the current bookmark
	bookmarkDepth: PropTypes.number.isRequired,
	bookmarkHighlight: PropTypes.number.isRequired,
	bookmarkNumLeadInStates: PropTypes.number,
	onDiscoveryTrailIndexClicked: PropTypes.func,
}

export default PlaybackPane
