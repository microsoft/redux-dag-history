import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const minPagerWidth = '6px'
const emptyStateColor = 'white'
const highlightedStateInactiveBookmarkColor = '#ABEBC6'
const highlightedStateColor = '#2ECC71'
const leadInStateColor = '#ABEBC6'
const emptyBookmarkColor = 'white'
const highlightedBookmarkInactiveBookmarkColor = '#ebc6ab'
const highlightedBookmarkColor = '#f93'
const leadInBookmarkColor = '#f5e2d4'
const statePagerBorderColor = '1px solid #cbcbcb'

export const PagerState = styled.div``

const Pager = (
	borderColor: string,
	highlightedColor: string,
	highlightedInactiveColor: string,
	leadInColor: string,
	emptyColor: string,
) =>
	styled.div`
		display: flex;
		&.radiusEdges {
			border-radius: 4px;
		}

		${PagerState} {
			&.highlighted {
				background-color: ${highlightedColor};
			}
			&.highlightedInactive {
				background-color: ${highlightedInactiveColor};
			}
			&.leadin {
				background-color: ${leadInColor};
			}
			&.empty {
				background-color: ${emptyColor};
			}
		}

		&.horizontal {
			${PagerState} {
				&.startItem {
					border-bottom-left-radius: 4px;
					border-top-left-radius: 4px;
				}
				&.endItem {
					border-bottom-right-radius: 4px;
					border-top-right-radius: 4px;
				}
			}

			border: ${borderColor};
			flex-direction: row;
			min-height: ${minPagerWidth};
			width: 100%;
		}

		&.vertical {
			${PagerState} {
				&.start {
					border-top-right-radius: 4px;
					border-top-left-radius: 4px;
				}
				&.end {
					border-bottom-left-radius: 4px;
					border-bottom-right-radius: 4px;
				}
			}
			border-left: ${borderColor};
			flex-direction: column;
			height: 100%;
			min-width: ${minPagerWidth};
		}
	`

export const StatePager = Pager(
	statePagerBorderColor,
	highlightedStateColor,
	highlightedStateInactiveBookmarkColor,
	leadInStateColor,
	emptyStateColor,
)

export const BookmarkPager = Pager(
	statePagerBorderColor,
	highlightedBookmarkColor,
	highlightedBookmarkInactiveBookmarkColor,
	leadInBookmarkColor,
	emptyBookmarkColor,
)
