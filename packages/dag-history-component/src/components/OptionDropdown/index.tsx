
import * as React from 'react'
const MdMoreVert = require('react-icons/lib/md/more-vert')
const {
	default: Dropdown,
	DropdownTrigger,
	DropdownContent,
} = require('react-simple-dropdown')
import './OptionDropdown.scss'

export interface OptionDropdownProps {
	label?: string
	icon?: JSX.Element
	options?: Array<{
		element?: JSX.Element
		label?: string
		onClick: Function
	}>
	triggerClass?: string
	contentClass?: string
}

export default class OptionDropdown extends React.Component<
	OptionDropdownProps
> {
	public static defaultProps = {
		options: [],
	}

	private dropdown: any

	public render() {
		const { label, icon, options, triggerClass, contentClass } = this.props
		let result = null
		if (options.length === 0) {
			result = label ? (
				<div className={`dropdown-label-only ${triggerClass}`}>{label}</div>
			) : null
		} else {
			const triggerLabel = label ? <div className="label">{label}</div> : null
			let triggerIcon = icon
			if (!triggerIcon && !label) {
				triggerIcon = <MdMoreVert size={24} style={{ margin: 4 }} />
			}
			if (triggerIcon) {
				triggerIcon = <div className="dropown-icon-wrapper">{triggerIcon}</div>
			}

			const optionClicked = onClick => {
				onClick()
				this.dropdown.hide()
			}

			const triggerClicked = () => {
				this.dropdown.show()
			}

			result = (
				<Dropdown ref={e => (this.dropdown = e)}>
					<DropdownTrigger
						className={`history-dropdown-trigger ${triggerClass}`}
						onClick={() => triggerClicked()}
					>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							{triggerLabel}
							{triggerIcon}
						</div>
					</DropdownTrigger>
					<DropdownContent
						className={`history-dropdown-content ${contentClass}`}
					>
						<ul>
							{options.map(
								(
									{ element: optionElement, label: optionLabel, onClick },
									index,
								) => (
									<li
										key={`option:${index}`}
										onClick={() => optionClicked(onClick)}
									>
										{optionElement || optionLabel}
									</li>
								),
							)}
						</ul>
					</DropdownContent>
				</Dropdown>
			)
		}
		return result
	}
}
