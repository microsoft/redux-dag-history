import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import BranchList from '../../../src/components/BranchList';

describe('The BranchList component', () => {
  it('can render an empty branch list', () => {
    const rendered = mount(
      <BranchList
        activeBranch={null}
        branches={[]}
      />
    );
    expect(rendered).to.be.ok;
  });

  it('can render an non-empty branch list', () => {
    let clickedId = null;
    const rendered = mount(
      <BranchList
        activeBranch={5}
        branches={[
        {
          id: 5,
          label: 'delta-1',
          startsAt: 5,
          endsAt: 10,
          maxDepth: 10,
          branchType: 'current',
        }
      ]}
        onBranchClick={(id) => clickedId = id}
      />
    );
    expect(rendered).to.be.ok;
    rendered.find('.history-branch').get(0);
    rendered.find('.history-branch').simulate('click');
    expect(clickedId).to.equal(5);
  });

  it('will not throw an error when an branch is clicked without an onClick handler defined', () => {
    const rendered = mount(
      <BranchList
        activeBranch={5}
        branches={[
        {
          id: 5,
          label: 'delta-1',
          startsAt: 5,
          endsAt: 10,
          maxDepth: 10,
          branchType: 'current',
        }
      ]}
      />
    );
    // click should be ok
    expect(rendered).to.be.ok;
    rendered.find('.history-branch').get(0);
    rendered.find('.history-branch').simulate('click');
  });
});
