import { IDagHistory } from '@essex/redux-dag-history/lib/interfaces';
import { IBookmark } from '../../interfaces';

export interface IHistoryContainerSharedProps {
  history: IDagHistory<any>;
  highlightSuccessorsOf?: number;
  mainView: string;
  historyType: string;
  dragIndex?: number;
  hoverIndex?: number;
  branchContainerExpanded?: boolean;
  selectedBookmark?: number;
  selectedBookmarkDepth?: number;
  isPlayingBack?: boolean;
  bookmarks: IBookmark[];

  getSourceFromState: Function;
  bookmarksEnabled?: boolean;

  /**
   * ControlBar Configuration Properties
   */
  controlBar?: {
    /**
     * A handler to save the history tree out. This is handled by clients.
     */
    onSaveHistory: Function;

    /**
     * A handler to retrieve the history tree. This is handled by clients
     */
    onLoadHistory: Function;

    /**
     * A function that emits a Promise<boolean> that confirms the clear-history operation.
     */
    onConfirmClear: Function;
  };
}
