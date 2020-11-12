import { register, unregister } from '../../src/api/model';
import { isFunction } from '../../src/helpers/type';

describe('model.ts', () => {
  it('测试 register 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    register(store);
    expect(isFunction(store.register)).toBeTruthy();
  });

  it('测试 store.register 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    register(store);
    expect(() => store.register()).toThrow();
  });

  it('测试 store.register 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    register(store);
    expect(
      store.register({
        namespace: 'agg',
        defaultState: undefined,
        reducers: {},
      })
    ).toBe(store);
  });

  it('测试 unregister 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    unregister(store);
    expect(isFunction(store.unregister)).toBeTruthy();
  });

  it('测试 store.unregister 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    unregister(store);
    expect(() => store.unregister()).toThrow();
  });

  it('测试 store.unregister 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    unregister(store);
    expect(store.unregister('agg')).toBe(store);
    expect(
      store.unregister({
        namespace: 'agg',
        reducers: {},
      })
    ).toBe(store);
  });
});
