import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Continuation from '../../../src/components/Continuation';

describe('The Continuation component', () => {
  it('can be rendered', () => {
    const rendered = mount(
      <Continuation />
    );
    expect(rendered).to.be.ok;
  });

  it('can render a sane continuation count', () => {
    const rendered = mount(
      <Continuation count={10} />
    );
    expect(rendered).to.be.ok;
    const found = rendered.find('.history-state-continuations');
    expect(found.html().indexOf('10')).to.be.gte(0);
    expect(found.length).to.equal(1);
  });

  it('can render a high count', () => {
    const rendered = mount(
      <Continuation count={1000} />
    );
    expect(rendered).to.be.ok;
    const found = rendered.find('.history-state-continuations');
    expect(found.html().indexOf('99+')).to.be.gte(0);
    expect(found.length).to.equal(1);
  });

  it('can be rendered', () => {
    let clicked = false;
    const rendered = mount(
      <Continuation onClick={() => clicked = true}/>
    );
    rendered.simulate('click');
    expect(clicked).to.be.true;
  });
});
