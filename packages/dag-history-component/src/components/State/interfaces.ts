import DagGraph from '@essex/redux-dag-history/lib/DagGraph';
import {
  StateId, // eslint-disable-line no-unused-vars
  IDagHistory, // eslint-disable-line no-unused-vars
} from '@essex/redux-dag-history/lib/interfaces';

export interface IStateProps {
  id: number;
  active?: boolean;
  renderBookmarks?: boolean;
  pinned?: boolean;
  successor?: boolean;
  state?: any;
  source?: string;
  label: string;
  numChildren?: number;
  bookmarked?: boolean;
  showContinuation?: boolean;
  branchType?: 'current' | 'legacy' | 'unrelated';
  onBookmarkClick?: (state: StateId) => void;
  onClick?: (state: StateId) => void;
  onContinuationClick?: (state: StateId) => void;
  style?: any;
}
