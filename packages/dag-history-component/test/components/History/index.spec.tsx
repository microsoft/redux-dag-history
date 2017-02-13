import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as Promise from 'bluebird';
import * as dagHistory from '@essex/redux-dag-history/lib/DagHistory';
import History from '../../../src/components/History';

import { createStore } from 'redux';

// It's kind of cheap, but rendering the top-level component
// gives us a lot of baseline statement test-coverage
describe('The History Component', () => {
  it('can be rendered in branched mode', () => {
    const store = createStore(() => ({}));
    const history = dagHistory.createHistory({}, 'initialBranch', 'initialState');
    const rendered = mount(
      <Provider store={store}>
        <History
          onSelectMainView={() => ({})}
          bookmarksEnabled
          bookmarks={[]}
          history={history}
          getSourceFromState={state => 'test source'}
          historyType="branched"
          branchContainerExpanded
          mainView="history"
          controlBar={{
            onConfirmClear: () => Promise.resolve(true),
            onLoadHistory: () => Promise.resolve({}),
            onSaveHistory: () => Promise.resolve(true),
          }}
        />
      </Provider>
    );
    expect(rendered).to.be.ok;
  });

  it('can be rendered in chronological mode', () => {
    const store = createStore(() => ({}));
    const history = dagHistory.createHistory({}, 'initialBranch', 'initialState');
    const rendered = mount(
      <Provider store={store}>
        <History
          onSelectMainView={() => ({})}
          bookmarksEnabled
          history={history}
          bookmarks={[]}
          getSourceFromState={state => 'test source'}
          historyType="chronological"
          mainView="history"
          controlBar={{
            onConfirmClear: () => Promise.resolve(true),
            onLoadHistory: () => Promise.resolve({}),
            onSaveHistory: () => Promise.resolve(true),
          }}
        />
      </Provider>
    );
    expect(rendered).to.be.ok;
  });

  xit('can be rendered in storyboarding mode', () => {
    const store = createStore(() => ({}));
    const history = dagHistory.createHistory({}, 'initialBranch', 'initialState');
    const rendered = mount(
      <Provider store={store}>
        <History
          onSelectMainView={() => ({})}
          bookmarksEnabled
          history={history}
          bookmarks={[]}
          getSourceFromState={state => 'test source'}
          historyType="chronological"
          mainView="storyboarding"
          controlBar={{
            onConfirmClear: () => Promise.resolve(true),
            onLoadHistory: () => Promise.resolve({}),
            onSaveHistory: () => Promise.resolve(true),
          }}
        />
      </Provider>
    );
    expect(rendered).to.be.ok;
  });

  xit('can be rendered in playback mode', () => {
    const store = createStore(() => ({}));
    const history = dagHistory.createHistory({}, 'initialBranch', 'initialState');

    const rendered = mount(
      <Provider store={store}>
        <History
          onSelectMainView={() => ({})}
          bookmarksEnabled
          bookmarks={[]}
          history={{...history, bookmarkPlaybackIndex: 0, bookmarks: [
            {
              stateId: 1,
              name: 'a thing happened',
              data: {
                annotation: 'welp',
              },
            },
          ]}}
          getSourceFromState={state => 'test source'}
          historyType="branched"
          mainView="storyboarding"
          controlBar={{
            onConfirmClear: () => Promise.resolve(true),
            onLoadHistory: () => Promise.resolve({}),
            onSaveHistory: () => Promise.resolve(true),
          }}
        />
      </Provider>
    );
    expect(rendered).to.be.ok;
  });
});
