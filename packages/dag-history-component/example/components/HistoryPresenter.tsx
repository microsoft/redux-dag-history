import * as React from 'react';
import { save, load } from '../persister';
import { IBookmark } from '../../src/interfaces';
import '../../src/daghistory.scss';
import createHistoryContainer from '../../src/components/createHistoryContainer';

const HistoryContainer = createHistoryContainer(state => state.app, state => state.component);

const { PropTypes } = React;

const HistoryPresenter: React.StatelessComponent<void> = (props) => {
  return (
    <div className='history-viz-container'>
      <HistoryContainer
        bookmarksEnabled
        getSourceFromState={state => (
          state.toJS ?
          state.toJS().metadata.source :
          state.metadata.source
        )}
        controlBar={{
          onSaveHistory: save,
          onLoadHistory: load,
          onConfirmClear: () => Promise.resolve(true),
        }}
      />
      <input id='pickFileInput' type='file' name='pickFileInput' style={{ display: 'none' }} />
    </div>
  );
};

export default HistoryPresenter;
