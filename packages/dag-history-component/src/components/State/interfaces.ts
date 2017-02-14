import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import {
  StateId, // eslint-disable-line no-unused-vars
  IDagHistory, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';

export interface IBaseStateProps {
  id: number;
  active?: boolean;
  renderBookmarks?: boolean;
  pinned?: boolean;
  successor?: boolean;
  branchType?: 'current' | 'legacy' | 'unrelated';
  onBookmarkClick?: (state: StateId) => void;
  onClick?: (state: StateId) => void;
  onContinuationClick?: (state: StateId) => void;
}

export interface IExpandableStateProps extends IBaseStateProps {
  historyGraph: DagGraph<any>;
  getSourceFromState: Function;
  successor: boolean;
  bookmarked: boolean;
}

export interface IStateProps extends IBaseStateProps {
  source?: string;
  label: string;
  numChildren?: number;
  bookmarked?: boolean;
  showContinuation?: boolean;
}

export interface IStateWithSuccessorsProps extends IStateProps {
  childStates: IStateProps[];
}
