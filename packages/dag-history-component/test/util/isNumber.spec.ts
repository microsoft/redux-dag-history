import { expect } from 'chai';
import isNumber from '../../src/util/isNumber';

describe('The isNumber module', () => {
  it('returns true on numeric inputs', () => {
    expect(isNumber(0)).to.be.true;
    expect(isNumber(1)).to.be.true;
    expect(isNumber(-1)).to.be.true;
    expect(isNumber(Number.MAX_VALUE)).to.be.true;
    expect(isNumber(Number.MIN_VALUE)).to.be.true;
  });

  it('returns false on non-numeric inputs', () => {
    expect(isNumber(NaN)).to.be.false;
    expect(isNumber(Infinity)).to.be.false;
    expect(isNumber({})).to.be.false;
    expect(isNumber(() => ({}))).to.be.false;
    expect(isNumber('')).to.be.false;
  });
});
