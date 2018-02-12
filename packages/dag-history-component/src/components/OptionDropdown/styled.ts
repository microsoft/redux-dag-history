import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'
const {
	default: DropdownRaw,
	DropdownTrigger: DropdownTriggerRaw,
	DropdownContent: DropdownContentRaw,
} = require('react-simple-dropdown')
import 'react-simple-dropdown/styles/Dropdown.css'

const white = '#fff'
const black = '#000'
const shadow = 'rgba(0, 0, 0, .2)'

export const DropdownTrigger = styled(DropdownTriggerRaw)`
	color: ${black};
	text-decoration: none;
	cursor: pointer;

	.dropown-icon-wrapper {
		color: ${black};
		display: flex;
		justify-content: flex-end;
		margin-left: 10px;
	}
`

export const TriggerContent = styled.div`
	display: flex;
	flex-direction: row;
	margin: 0 5px 5px 0;
`

export const DropdownContent = styled(DropdownContentRaw)`
	background-color: ${white};
	box-shadow: 0 8px 16px 0 ${shadow};
	display: none;
	margin-top: 5px;
	right: 5px;
	min-width: 160px;
	position: relative;
	z-index: 1;
`

export const OptionList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`

export const ListItem = styled.li`
	margin: 0;
	padding: 10px 14px;
	cursor: pointer;
`
