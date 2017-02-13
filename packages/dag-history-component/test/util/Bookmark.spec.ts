import { expect } from 'chai';
import Bookmark from '../../src/util/Bookmark';

class TestableBookmark extends Bookmark {
  constructor(bookmark, private commitPathVar: number[]) { // eslint-disable-line
    super(bookmark, null);
  }

  public get commitPath() {
    return this.commitPathVar;
  }
}

describe('The Bookmark Class', () => {
  it('can be constructed', () => {
    const bm = new TestableBookmark({}, []);
    expect(bm).to.be.ok;
  });

  it('can determine the number of lead-in states', () => {
    let bm = new TestableBookmark({ data: { numLeadInStates: 3 } }, []);
    expect(bm.numLeadInStates).to.equal(3);

    bm = new TestableBookmark({ data: {} }, []);
    expect(bm.numLeadInStates).to.equal(undefined);

    bm = new TestableBookmark({}, []);
    expect(bm.numLeadInStates).to.equal(undefined);
  });

  it('can determine the annotation', () => {
    let bm = new TestableBookmark({}, []);
    expect(bm.annotation).to.be.undefined;

    bm = new TestableBookmark({ data: {} }, []);
    expect(bm.annotation).to.be.undefined;

    bm = new TestableBookmark({ data: { annotation: 'abc123' } }, []);
    expect(bm.annotation).to.equal('abc123');
  });

  it('can determine the bookmark name', () => {
    const bm = new TestableBookmark({ name: 'derp' }, []);
    expect(bm.name).to.equal('derp');
  });

  it('can determine the state id', () => {
    const bm = new TestableBookmark({ stateId: 5 }, []);
    expect(bm.stateId).to.equal(5);
  });

  it('can determine the slide text for the current bookmark', () => {
    let bm = new TestableBookmark({ data: { annotation: 'anno' } }, []);
    expect(bm.slideText).to.equal('anno');

    bm = new TestableBookmark({ name: 'derp' }, []);
    expect(bm.slideText).to.equal('derp');

    bm = new TestableBookmark({ }, []);
    expect(bm.slideText).to.equal('No slide data');
  });

  it('can determine the presented path', () => {
    let bm = new TestableBookmark({ data: { numLeadInStates: 1 } }, [1, 2, 3, 4]);
    expect(bm.presentedPath).to.deep.equal([3, 4]);
    expect(bm.presentedPathLength).to.equal(2);
    expect(bm.hiddenPathLength).to.equal(2);

    bm = new TestableBookmark({ data: {} }, [1, 2, 3, 4]);
    expect(bm.presentedPath).to.deep.equal([4]);
    expect(bm.presentedPathLength).to.equal(1);
    expect(bm.hiddenPathLength).to.equal(3);
  });

  it('can determine starting and ending depth', () => {
    let bm = new TestableBookmark({ data: { numLeadInStates: 1 } }, [1, 2, 3, 4]);
    expect(bm.startingDepth()).to.equal(2);
    expect(bm.isDepthAtStart(2)).to.be.true;
    expect(bm.isDepthAtEnd(0)).to.be.false;
    expect(bm.isDepthAtEnd(3)).to.be.true;
    expect(bm.isDepthAtEnd(undefined)).to.be.true;

    bm = new TestableBookmark({ data: {} }, [1, 2, 3, 4]);
    expect(bm.startingDepth()).to.be.undefined;
    expect(bm.isDepthAtStart(3)).to.be.true;
    expect(bm.isDepthAtEnd(0)).to.be.false;
    expect(bm.isDepthAtEnd(3)).to.be.true;
    expect(bm.isDepthAtEnd(undefined)).to.be.true;
  });

  it('can get a state at a depth', () => {
    const bm = new TestableBookmark({ data: { numLeadInStates: 1 } }, [1, 2, 3, 4]);
    expect(bm.getStateAtDepth(undefined)).to.equal(4);
    expect(bm.getStateAtDepth(0)).to.equal(1);
  });

  it('can sanitize a depth', () => {
    const bm = new TestableBookmark({ data: { numLeadInStates: 1 } }, [1, 2, 3, 4]);
    expect(bm.sanitizeDepth(undefined)).to.equal(3);
  });
});
