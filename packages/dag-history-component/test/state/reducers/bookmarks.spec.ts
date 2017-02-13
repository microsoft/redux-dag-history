import { expect } from 'chai';
import reduce from '../../../src/state/reducers/bookmarks';
import {
  addBookmark,
  removeBookmark,
  renameBookmark,
  changeBookmark,
  moveBookmark,
} from '../../../src/state/actions/creators';

const fan = bookmarks => bookmarks.map(b => b.stateId);

describe('The bookmarks reducer', () => {
  it('emits an empty bookmarks array by default', () => {
    expect(reduce(undefined, { type: 'derp' })).to.deep.equal([]);
  });

  it('can add a bookmark', () => {
    const state = reduce(undefined, addBookmark({ stateId: 1, name: 'derp' }));
    expect(state).to.deep.equal([
      { stateId: 1, name: 'derp', data: {} },
    ]);
  });

  it('can add a bookmark with data', () => {
    const state = reduce(undefined, addBookmark({ stateId: 1, name: 'derp', data: { x: 1 } }));
    expect(state).to.deep.equal([
      { stateId: 1, name: 'derp', data: { x: 1 } },
    ]);
  });

  it('can remove a bookmark', () => {
    let state;
    state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }));
    state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }));
    state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }));

    expect(state.length).to.equal(3);

    state = reduce(state, removeBookmark(2));
    expect(state.length).to.equal(2);
    expect(fan(state)).to.deep.equal([1, 3]);
  });

  it('can rename a bookmark', () => {
    let state;
    state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }));
    state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }));
    state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }));

    state = reduce(state, renameBookmark({ stateId: 2, name: 'newName' }));
    expect(state[1].name).to.equal('newName');
  });

  it('can change a bookmark', () => {
    let state;
    state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }));
    state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }));
    state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }));

    state = reduce(state, changeBookmark({ stateId: 2, name: 'newName', data: { x: 1 } }));
    expect(state[1].name).to.equal('newName');
    expect(state[1].data).to.deep.equal({ x: 1 });
  });

  it('can move a bookmark', () => {
    let state;
    state = reduce(state, addBookmark({ stateId: 1, name: 'state1' }));
    state = reduce(state, addBookmark({ stateId: 2, name: 'state2' }));
    state = reduce(state, addBookmark({ stateId: 3, name: 'state3' }));

    state = reduce(state, moveBookmark({ from: 0, to: 2 }));
    expect(fan(state)).to.deep.equal([2, 3, 1]);

    state = reduce(state, moveBookmark({ from: 2, to: 0 }));
    expect(fan(state)).to.deep.equal([1, 2, 3]);
  });
});
