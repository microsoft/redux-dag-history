import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import BookmarkList from '../../../src/components/BookmarkList';
import Bookmark from '../../../src/components/Bookmark';

xdescribe('The BookmarkList Component', () => {
  it('can render a set of bookmarks', () => {
    const rendered = mount(
      <BookmarkList
        bookmarks={[
          {
            index: 0,
            stateId: 1,
            name: 'Bookmark 1',
            annotation: 'Anno 1',
            active: true,
          },
          {
            index: 1,
            stateId: 2,
            name: 'Bookmark 2',
            annotation: 'Anno 2',
            active: false,
          },
          {
            index: 2,
            stateId: 3,
            name: 'Bookmark 3',
            annotation: 'Anno 3',
            active: false,
          },
        ]}
      />
    );
    expect(rendered.find('.history-bookmark').length).to.equal(3);
    expect(rendered).to.be.ok;
  });

  xit('can propagate up bookmark clicks', () => {
    let clickedIndex = null;
    let clickedStateId = null;
    const rendered = mount(
      <BookmarkList
        onBookmarkClick={(index, stateId) => {
          clickedIndex = index;
          clickedStateId = stateId;
        }}
        bookmarks={[
          {
            index: 0,
            stateId: 1,
            name: 'Bookmark 1',
            annotation: 'Anno 1',
            active: true,
          },
          {
            index: 1,
            stateId: 2,
            name: 'Bookmark 2',
            annotation: 'Anno 2',
            active: false,
          },
          {
            index: 2,
            stateId: 3,
            name: 'Bookmark 3',
            annotation: 'Anno 3',
            active: false,
          },
        ]}
      />
    );

    rendered.find(Bookmark).at(1).simulate('click');
    expect(clickedIndex).to.equal(1);
    expect(clickedStateId).to.equal(2);
  });

  it('can handle click events when no handler is defined', () => {
    const rendered = mount(
      <BookmarkList
        bookmarks={[
          {
            index: 0,
            stateId: 1,
            name: 'Bookmark 1',
            annotation: 'Anno 1',
            active: true,
          }
        ]}
      />
    );
    rendered.find(Bookmark).at(0).simulate('click');
  });
});
