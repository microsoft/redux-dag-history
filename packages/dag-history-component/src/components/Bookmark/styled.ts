import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const white = '#fff'
const highlight = '#f00'
const background = '#f5e2d4'
const selectedBackground = '#ebc6ab'
const gray = '#d1d1d1'
const charcoal = '#5d6d7e'
const black = '#000'

export const Dragged = styled.div`
	min-height: 30px;
	background-color: grey;
`

export const Container = styled.div`
	border-top: 1px solid ${white};
	align-items: center;
	background-color: ${background};
	display: flex;
	min-height: 30px;
	min-width: 250px;
	position: relative;

	&.active {
		background-color: ${selectedBackground};

		&:hover {
			border-right: 3px solid ${highlight};
		}

		&:not(:hover) {
			border-right: 3px solid ${selectedBackground};
		}
	}

	&:not(:hover) {
		border-right: 3px solid ${background};
	}

	&:hover {
		border-right: 3px solid ${highlight};
	}

	.label {
		font-family: sans-serif;
		font-size: 11pt;
		font-weight: 300;
	}
`

const DetailsBase = styled.div`
	align-self: stretch;
	font-family: sans-serif;
	left: 0;
	top: 0;
`

export const DetailsContainer = DetailsBase.extend`
	flex-direction: column;
	flex: 1;
`

export const Details = DetailsBase.extend`
	align-items: flex-start;
	flex-direction: column;
	padding: 4px;
`

export const Title = DetailsBase.extend`
	&:active {
		color: ${black};
	}

	&:not(.active) {
		color: ${charcoal};
	}
`

export const Annotation = DetailsBase.extend`
	color: ${charcoal};
	font-size: 9pt;
	margin-top: 5px;
`

export const DetailsEditable = DetailsBase.extend`
	align-items: stretch;
	flex-direction: column;
	padding: 10px;
	width: 100%;
`

export const EditableTitleContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

export const EditAnnotation = styled.textarea`
	background-color: $white;
	border: 1px solid $gray;
	border-radius: 4px;
	box-shadow: none;
	box-sizing: border-box;
	flex: 1;
	padding: 6px 10px;
	width: 100%;
	margin-top: 5px;
`

export const ControlsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	.bookmark-controls {
		display: flex;
		flex-direction: row;
		flex: 1;
	}
`

export const DiscoveryTrailLabel = styled.span`
	font-size: 9pt;
	font-weight: lighter;
`

export const DiscoveryTrailInfoButton = styled.button`
	font-size: 9px;
	height: 25px;
	line-height: 25px;
	padding: 0 15px;
	margin-left: 5px;
`
