import { createDispatch } from '../../src/api/dispatch';
import { isFunction } from '../../src/helpers/type';

describe('dispatch.ts', () => {
  it('测试 createDispatch 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    createDispatch(store);
    expect(isFunction(store.dispatch)).toBeTruthy();
  });
});
