import {
  IConfiguration, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';

export interface IComponentConfiguration<T> extends IConfiguration<T> {
  initialViewState?: {
    mainView?: string;
    historyType?: string;
    branchContainerExpanded?: boolean;
  };
}
