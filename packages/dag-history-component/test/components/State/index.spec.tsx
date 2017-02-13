import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import State from '../../../src/components/State/State';
import Continuation from '../../../src/components/Continuation';
const Bookmark = require('react-icons/lib/io/bookmark');

describe('The State Component', () => {
  it('can be rendered', () => {
    let rendered = mount(<State id={1} source="abc" label="def" />);
    expect(rendered).to.be.ok;

    rendered = mount(
      <State id={1} label="A State" branchType="current"/>
    );
    expect(rendered).to.be.ok;

    rendered = mount(
      <State id={1} label="A State" branchType="current" renderBookmarks />
    );
    expect(rendered).to.be.ok;

    rendered = mount(
      <State id={1} label="A State" branchType="current" renderBookmarks bookmarked/>
    );
    expect(rendered).to.be.ok;

    rendered = mount(
      <State id={1} label="A State" branchType="current" renderBookmarks bookmarked pinned/>
    );
    expect(rendered).to.be.ok;

    rendered = mount(
      <State id={1} label="A State" branchType="current" renderBookmarks bookmarked successor/>
    );
    expect(rendered).to.be.ok;
  });

  it('can handle clicks when click handlers are not defined without throwing', () => {
    const rendered = mount(<State id={1} label="a state" renderBookmarks />);
    rendered.simulate('click');
    rendered.find(Continuation).simulate('click');
    rendered.find(Bookmark).simulate('click');
  });

  it('can handle clicks', () => {
    let clicked = false;
    let continuationClicked = false;
    let bookmarkClicked = false;
    const rendered = mount(
      <State
        id={1}
        label="a label"
        renderBookmarks
        onClick={() => clicked = true}
        onContinuationClick={() => continuationClicked = true}
        onBookmarkClick={() => bookmarkClicked = true}
      />
    );
    rendered.simulate('click');
    expect(clicked).to.be.true;
    rendered.find(Continuation).simulate('click');
    expect(continuationClicked).to.be.true;
    rendered.find(Bookmark).simulate('click');
    expect(bookmarkClicked).to.be.true;
  });
});
