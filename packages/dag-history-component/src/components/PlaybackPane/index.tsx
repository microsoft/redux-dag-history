import * as debug from 'debug'
import * as React from 'react'
import DiscoveryTrail from '../DiscoveryTrail'
import { Container, Paged, Pane } from './styled'
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
		<Container>
			<Paged>
				<Pane>
					<h3>{text}</h3>
				</Pane>
				<DiscoveryTrail
					vertical={true}
					fullWidth={true}
					bookmark={true}
					active={true}
					depth={depth - 1}
					highlight={highlight}
				/>
			</Paged>
			<DiscoveryTrail
				active={true}
				fullWidth={true}
				leadIn={bookmarkNumLeadInStates}
				depth={bookmarkDepth - 1}
				highlight={bookmarkHighlight}
				onIndexClicked={(idx: number) => onDiscoveryTrailIndexClicked(idx)}
			/>
		</Container>
	)
}

export default PlaybackPane
