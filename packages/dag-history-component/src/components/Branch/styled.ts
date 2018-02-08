import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const black = '#000'
const white = '#fff'
const highlight = '#f93'
const charcoal = '#5d6d7e'

export const Container = styled.div`
	border-top: 1px solid ${white};
	min-height: 30px;
	min-width: 250px;
	position: relative;
	overflow: hidden;

	&:not(:hover) {
		border-right: 3px solid transparent;
	}

	&:hover {
		border-right: 3px solid ${highlight};
	}
`

export const Details = styled.div`
	align-items: center;
	align-self: stretch;
	display: flex;
	height: 100%;
	left: 0;
	padding-left: 5px;
	position: absolute;
	top: 0;
	width: 100%;
	overflow: hidden;
	cursor: pointer;
`
export const Name = styled.div`
	font-weight: 300;

	&:active {
		color: ${black};
	}

	&:not(.active) {
		color: ${charcoal};
	}
`

export const ProfileContainer = styled.div`
	align-items: center;
	align-self: stretch;
	display: flex;
	height: 100%;
	left: 0;
	position: absolute;
	top: 0;
	width: 100%;
	overflow: hidden;
`
