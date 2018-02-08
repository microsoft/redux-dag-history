import * as react from 'react'
import styled, { StyledComponentClass } from 'styled-components'

const grey = '#797d7f'

export const Container = styled.div`
	border: 2px solid ${grey};
	border-radius: 10px;
	box-sizing: content-box;
	display: inline-block;
	font-family: monospace;
	font-size: 8pt;
	font-weight: 600;
	height: 14px;
	min-width: 14px;
	line-height: 14px;
	min-height: 14px;
	padding: 2px;
	text-align: center;
`
