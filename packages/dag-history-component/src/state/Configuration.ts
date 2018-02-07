import Configuration from '@essex/redux-dag-history/lib/Configuration'
import { ComponentConfiguration, RawComponentConfiguration } from './interfaces' // eslint-disable-line no-unused-vars

export default class ComponentConfigurationImpl<T> extends Configuration<T>
	implements ComponentConfiguration<T> {
	constructor(rawConfig: RawComponentConfiguration<T> = {}) {
		super(rawConfig as any)
	}

	private get config() {
		return this.rawConfig as ComponentConfiguration<T>
	}

	public get initialViewState() {
		return this.config.initialViewState || {}
	}
}
