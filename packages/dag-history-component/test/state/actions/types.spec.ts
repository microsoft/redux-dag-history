import { expect } from 'chai';
import * as types from '../../../src/state/actions/types';

describe('Action Types', () => {
  it('should all be strings', () => {
    Object.keys(types).forEach(key => expect(types[key]).to.be.a('string'));
  });
});
