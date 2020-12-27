import { assert } from '../../src/helpers/assert';

describe('assert.ts', () => {
  it('断言通过', () => {
    expect(assert(true, '')).toBeUndefined();
  });

  it('断言失败', () => {
    expect(() => assert(false, 'error')).toThrow(`[redux-agg]: error`);
  });
});
