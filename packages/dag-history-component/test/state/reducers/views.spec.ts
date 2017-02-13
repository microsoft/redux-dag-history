import { expect } from 'chai';
import { default as makeReducer, INITIAL_STATE } from '../../../src/state/reducers/views';

import {
  selectMainView,
  selectHistoryType,
  toggleBranchContainer,
} from '../../../src/state/actions/creators';

const defaultConfig = {
  actionFilter: () => false,
};

describe('The Views reducer', () => {
  it('will emit an initial dragDrop state', () => {
    const state = makeReducer(defaultConfig)(undefined, { type: 'derp' });
    expect(state).to.deep.equal(INITIAL_STATE);
  });

  it('can handle a selectMainView event', () => {
    const reduce = makeReducer(defaultConfig);
    const state = reduce(undefined, selectMainView('bookmarks'));
    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      mainView: 'bookmarks',
    });
  });

  it('can handle a selectHistoryType event', () => {
    const reduce = makeReducer(defaultConfig);
    const state = reduce(undefined, selectHistoryType('derp'));
    expect(state).to.deep.equal({
      ...INITIAL_STATE,
      historyType: 'derp',
    });
  });

  it('can handle a toggleBranchContainer event', () => {
    let state;
    const reduce = makeReducer(defaultConfig);
    state = reduce(state, { type: 'derp' });
    expect(state.branchContainerExpanded).to.be.true;

    state = reduce(state, toggleBranchContainer({ index: 3 }));
    expect(state.branchContainerExpanded).to.be.false;

    state = reduce(state, toggleBranchContainer({ index: 3 }));
    expect(state.branchContainerExpanded).to.be.true;
  });
});
