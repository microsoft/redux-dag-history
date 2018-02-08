const EVENT_MATCHERS = {
	HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
}

interface Options {
	pointerX: number
	pointerY: number
	button: number
	ctrlKey: boolean
	altKey: boolean
	shiftKey: boolean
	metaKey: boolean
	bubbles: boolean
	cancelable: boolean
}

type Optional<T> = { [K in keyof T]?: T[K] }

const DEFAULT_OPTIONS = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true,
}

//
// From http://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript
//
export default function simulate(
	element: HTMLElement,
	eventName: string,
	opts: Optional<Options> = {},
) {
	const options = { ...DEFAULT_OPTIONS, ...opts }
	let oEvent = null
	let eventType = null

	for (const name in EVENT_MATCHERS) {
		if (EVENT_MATCHERS[name].test(eventName)) {
			eventType = name
			break
		}
	}

	if (!eventType) {
		throw new SyntaxError(
			'Only HTMLEvents and MouseEvents interfaces are supported',
		)
	}

	if (document.createEvent) {
		oEvent = document.createEvent(eventType)
		if (eventType === 'HTMLEvents') {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable)
		} else {
			oEvent.initMouseEvent(
				eventName,
				options.bubbles,
				options.cancelable,
				document.defaultView,
				options.button,
				options.pointerX,
				options.pointerY,
				options.pointerX,
				options.pointerY,
				options.ctrlKey,
				options.altKey,
				options.shiftKey,
				options.metaKey,
				options.button,
				element,
			)
		}
		element.dispatchEvent(oEvent)
	} else {
		// tslint:disable-next-line no-string-literal
		const evt = document['createEventObject']()
		// tslint:disable-next-line no-string-literal
		element['fireEvent'](`on${eventName}`, {
			...evt,
			...options,
			clientX: options.pointerX,
			clientY: options.pointerY,
		})
	}
	return element
}
