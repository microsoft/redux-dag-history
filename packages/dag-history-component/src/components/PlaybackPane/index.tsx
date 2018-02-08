import * as debug from 'debug'
import * as React from 'react'
import './PlaybackPane.scss'
import DiscoveryTrail from '../DiscoveryTrail'

const log = debug('dag-history-component:components:PlaybackPane')

export interface PlaybackPaneProps {
	text: string
	depth: number
	highlight: number
	bookmarkDepth: number
	bookmarkHighlight: number
	bookmarkNumLeadInStates?: number
	onDiscoveryTrailIndexClicked?: Function
}

const PlaybackPane: React.StatelessComponent<PlaybackPaneProps> = props => {
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
					vertical={true}
					fullWidth={true}
					bookmark={true}
					active={true}
					depth={depth - 1}
					highlight={highlight}
				/>
			</div>
			<DiscoveryTrail
				active={true}
				fullWidth={true}
				leadIn={bookmarkNumLeadInStates}
				depth={bookmarkDepth - 1}
				highlight={bookmarkHighlight}
				onIndexClicked={idx => onDiscoveryTrailIndexClicked(idx)}
			/>
		</div>
	)
}

export default PlaybackPane
