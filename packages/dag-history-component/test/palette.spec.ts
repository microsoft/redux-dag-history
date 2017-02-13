import { expect } from 'chai';
import palette from '../src/palette';

describe('The Palette Module', () => {
  it('exposes a default colors object full of color strings', () => {
    Object.keys(palette).forEach(k => expect(palette[k]).to.be.a('string'));
  });
});
