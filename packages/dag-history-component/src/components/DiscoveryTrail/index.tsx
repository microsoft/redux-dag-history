import * as classnames from 'classnames'
import * as debug from 'debug'
import * as React from 'react'
import calculateSpans from './calculateSpans'
import calculateIndex from '../../util/calculateIndex'
import { StatePager, BookmarkPager, PagerState } from './styled'

const log = debug('dag-history-component:components:DiscoveryTrail')

export interface DiscoveryTrailProps {
	/**
	 * If true, renders in vertical mode
	 */
	vertical?: boolean

	/**
	 * If true, then the path this trail represents is currently active
	 */
	active?: boolean

	/**
	 * If true, this trail represents a bookmark list, and does not bother with lead-ins
	 */
	bookmark?: boolean

	/**
	 * The highlighted index
	 */
	highlight?: number

	/**
	 * The number of states in the trail
	 */
	depth: number

	/**
	 * The number of lead-in states to show
	 */
	leadIn?: number

	/**
	 * An event handler for when the state pager has clicked an item
	 */
	onIndexClicked?: Function

	/**
	 * If not full width, renders curved ends
	 */
	fullWidth?: boolean
}

export default class DiscoveryTrail extends React.Component<
	DiscoveryTrailProps,
	{}
> {
	public static defaultProps = {
		vertical: false,
		active: false,
		depth: 0,
		highlight: undefined,
		leadIn: undefined,
		fullWidth: false,
	}

	private containerDiv: HTMLDivElement

	private handleClick(evt: React.MouseEvent<any>) {
		const { target } = event
		const { onIndexClicked } = this.props
		const bounds = this.containerDiv.getBoundingClientRect()

		const x = evt.clientX - bounds.left
		const width = bounds.right - bounds.left
		const percent = x / width
		const index = calculateIndex(this.props.depth + 1, percent)
		if (onIndexClicked) {
			log('selected index %s', index)
			onIndexClicked(index)
		}
	}

	private get pagerComponent() {
		return this.props.bookmark ? BookmarkPager : StatePager
	}

	private get pagerClass() {
		const { vertical, fullWidth: isFullWidth } = this.props
		const horizontal = !vertical
		const radiusEdges = !isFullWidth
		return classnames({
			vertical,
			horizontal,
			radiusEdges,
		})
	}

	public render() {
		const {
			vertical,
			depth,
			highlight,
			leadIn,
			active,
			bookmark: isBookmark,
			fullWidth: isFullWidth,
		} = this.props
		const spans = calculateSpans(depth, highlight, leadIn, active)
		const Pager = this.pagerComponent
		const spanTags = spans.map((s, index) => (
			<PagerState
				key={`pagerSpan::${index}`}
				className={classnames(s.type, {
					startItem: !isFullWidth && index === 0,
					endItem: !isFullWidth && index === spans.length - 1,
				})}
				style={{ flex: s.length }}
			/>
		))

		return (
			<Pager
				className={this.pagerClass}
				onClick={e => this.handleClick(e)}
				ref={e => (this.containerDiv = e)}
			>
				{spanTags}
			</Pager>
		)
	}
}
