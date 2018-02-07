
import * as React from 'react'
const MdExpandMore = require('react-icons/lib/md/expand-more')
const MdExpandLess = require('react-icons/lib/md/expand-less')

export interface ExpandCollapseToggleProps {
	isExpanded?: boolean
	onClick: () => void
}

const ExpandCollapseToggle: React.StatelessComponent<
	ExpandCollapseToggleProps
> = ({ isExpanded, onClick }) =>
	isExpanded ? (
		<MdExpandLess onClick={onClick} />
	) : (
		<MdExpandMore onClick={onClick} />
	)

export default ExpandCollapseToggle
