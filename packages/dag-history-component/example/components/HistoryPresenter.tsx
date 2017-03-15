import * as React from 'react';
import { save, load } from '../persister';
import { IBookmark } from '../../src/interfaces';
import '../../src/daghistory.scss';
import createHistoryContainer from '../../src/components/createHistoryContainer';
import { get } from 'lodash';

const HistoryContainer = createHistoryContainer(
  state => state.app,
  state => state.component,
  state => get(state, 'metadata.source')
);

const { PropTypes } = React;

const HistoryPresenter: React.StatelessComponent<void> = (props) => {
  return (
    <div className="history-viz-container">
      <HistoryContainer
        bookmarksEnabled
        controlBarEnabled
        controlBar={{
          onSaveHistory: save,
          onLoadHistory: load,
          onConfirmClear: () => Promise.resolve(true),
        }}
      />
      <input id="pickFileInput" type="file" name="pickFileInput" style={{ display: 'none' }} />
    </div>
  );
};

export default HistoryPresenter;
