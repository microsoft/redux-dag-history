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

export interface Option {
	element?: JSX.Element
	label?: string
	onClick: Function
}

export interface OptionDropdownProps {
	label?: string
	icon?: JSX.Element
	options?: Option[]
}

export interface OptionDropdownState {
	show: boolean
}

export default class OptionDropdown extends React.Component<
	OptionDropdownProps,
	OptionDropdownState
> {
	public static defaultProps = {
		options: [] as Option[],
	}

	constructor(props: OptionDropdownProps) {
		super(props)
		this.state = { show: false }
	}

	public render() {
		const { label, icon, options } = this.props
		let result = null
		if (options.length === 0) {
			result = label ? <div>{label}</div> : null
		} else {
			const triggerLabel = label ? <div className="label">{label}</div> : null
			let triggerIcon = icon
			if (!triggerIcon && !label) {
				triggerIcon = <MdMoreVert size={24} style={{ margin: 4 }} />
			}
			if (triggerIcon) {
				triggerIcon = <div>{triggerIcon}</div>
			}

			const optionClicked = (onClick: Function) => {
				onClick()
				this.setState({ show: false })
			}

			const triggerClicked = () => {
				this.setState({ show: true })
			}

			result = (
				<Dropdown active={this.state.show}>
					<DropdownTrigger onClick={() => triggerClicked()}>
						<TriggerContent>
							{triggerLabel}
							{triggerIcon}
						</TriggerContent>
					</DropdownTrigger>
					<DropdownContent>
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
