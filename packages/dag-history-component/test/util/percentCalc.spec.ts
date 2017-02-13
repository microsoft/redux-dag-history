import { expect } from 'chai';
import calculateIndex from '../../src/util/calculateIndex';

const adjust = (x: number) => x - 0.001;

describe('Percent calculations (for mouse intercepts in a DOM element)', () => {
  it('can determine the item to select based on a percentage range', () => {
    // [[--|---|---|---]
    expect(calculateIndex(4, -1)).to.equal(0);

    // [[--|---|---|---]
    expect(calculateIndex(4, 0)).to.equal(0);

    // [x--|---|---|---]
    expect(calculateIndex(4, adjust(1 / 12))).to.equal(0);

    // [-x-|---|---|---]
    expect(calculateIndex(4, adjust(2 / 12))).to.equal(0);

    // [--x|---|---|---]
    expect(calculateIndex(4, adjust(3 / 12))).to.equal(0);

    // [---|x--|---|---]
    expect(calculateIndex(4, adjust(4 / 12))).to.equal(1);

    // [---|-x-|---|---]
    expect(calculateIndex(4, adjust(5 / 12))).to.equal(1);

    // [---|--x|---|---]
    expect(calculateIndex(4, adjust(6 / 12))).to.equal(1);

    // [---|---|x--|---]
    expect(calculateIndex(4, adjust(7 / 12))).to.equal(2);

    // [---|---|-x-|---]
    expect(calculateIndex(4, adjust(8 / 12))).to.equal(2);

    // [---|---|--x|---]
    expect(calculateIndex(4, adjust(9 / 12))).to.equal(2);

    // [---|---|---|x--]
    expect(calculateIndex(4, adjust(10 / 12))).to.equal(3);

    // [---|---|---|-x-]
    expect(calculateIndex(4, adjust(11 / 12))).to.equal(3);

    // [---|---|---|--x]
    expect(calculateIndex(4, adjust(12 / 12))).to.equal(3);

    // [--|---|---|---]]
    expect(calculateIndex(4, 1.0)).to.equal(3);
  });
});
