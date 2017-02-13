import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import StateList from '../../../src/components/StateList';
import State from '../../../src/components/State';
import Continuation from '../../../src/components/Continuation';
const Bookmark = require('react-icons/lib/io/bookmark');

xdescribe('The StateList component', () => {
  it('can render a set of states', () => {
    let rendered = mount(<StateList states={[]} />);
    expect(rendered.find(State).length).to.equal(0);

    let stateClicked = null;
    let continuationClicked = null;
    let bookmarkClicked = null;
    rendered = mount(
      <StateList states={[
          {
            id: 100,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 200,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 300,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'legacy',
            continuation: {},
          },
        ]}
        renderBookmarks
        onStateClick={id => stateClicked = id}
        onStateContinuationClick={id => continuationClicked = id}
        onStateBookmarkClick={id => bookmarkClicked = id}
      />
    );
    expect(rendered.find(State).length).to.equal(3);
    const lastState = rendered.find(State).at(2);

    // Click on the state
    lastState.simulate('click');
    expect(stateClicked).to.equal(300);

    // Click on the continuation
    lastState.find(Continuation).simulate('click');
    expect(continuationClicked).to.equal(300);

    // Click on the Bookmark
    lastState.find(Bookmark).simulate('click');
    expect(bookmarkClicked).to.equal(300);
  });

  it('can handle state clicks when no handlers are defined without throwing', () => {
    const rendered = mount(
      <StateList states={[
          {
            id: 100,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 200,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 300,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'legacy',
            continuation: {},
          },
        ]}
        renderBookmarks
      />
    );
    expect(rendered.find(State).length).to.equal(3);
    const lastState = rendered.find(State).at(2);

    // Click on the state
    lastState.simulate('click');

    // Click on the continuation
    lastState.find(Continuation).simulate('click');

    // Click on the Bookmark
    lastState.find(Bookmark).simulate('click');
  });

  it('can render a set of states without bookmarks', () => {
    const rendered = mount(
      <StateList states={[
          {
            id: 100,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 200,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'current',
            continuation: {},
          },
          {
            id: 300,
            source: 'A Component',
            label: 'Did a Thing',
            branchType: 'legacy',
            continuation: {},
          },
        ]}
      />
    );
    expect(rendered.find(Bookmark).length).to.equal(0);
  });
});
