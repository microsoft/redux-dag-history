import Configuration from '@essex/redux-dag-history/lib/configuration';
import { IComponentConfiguration } from './interfaces';  // eslint-disable-line no-unused-vars

export default class ComponentConfiguration<T>
  extends Configuration<T>
  implements IComponentConfiguration<T> {
  constructor(rawConfig: IComponentConfiguration<T>) {
    super(rawConfig);
  }

  private get config() {
    return this.rawConfig as IComponentConfiguration<T>;
  }

  public get initialViewState() {
    return this.config.initialViewState || {};
  }
}
