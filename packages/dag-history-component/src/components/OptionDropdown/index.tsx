import * as React from 'react'
import {
	DropdownTrigger,
	TriggerContent,
	DropdownContent,
	OptionList,
	ListItem,
} from './styled'
const MdMoreVert = require('react-icons/lib/md/more-vert')
const { default: Dropdown } = require('react-simple-dropdown')

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
			result = label ? <div className={triggerClass}>{label}</div> : null
		} else {
			const triggerLabel = label ? <div className="label">{label}</div> : null
			let triggerIcon = icon
			if (!triggerIcon && !label) {
				triggerIcon = <MdMoreVert size={24} style={{ margin: 4 }} />
			}
			if (triggerIcon) {
				triggerIcon = <div>{triggerIcon}</div>
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
						className={triggerClass}
						onClick={() => triggerClicked()}
					>
						<TriggerContent>
							{triggerLabel}
							{triggerIcon}
						</TriggerContent>
					</DropdownTrigger>
					<DropdownContent className={contentClass}>
						<OptionList>
							{options.map(
								(
									{ element: optionElement, label: optionLabel, onClick },
									index,
								) => (
									<ListItem
										key={`option:${index}`}
										onClick={() => optionClicked(onClick)}
									>
										{optionElement || optionLabel}
									</ListItem>
								),
							)}
						</OptionList>
					</DropdownContent>
				</Dropdown>
			)
		}
		return result
	}
}
