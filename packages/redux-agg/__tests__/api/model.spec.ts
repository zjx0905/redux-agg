import { initModel } from '../../src/api/model';
import { isFunction } from '../../src/helpers/type';

describe('model.ts', () => {
  it('测试 initModel 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    initModel(store);
    expect(isFunction(store.register)).toBeTruthy();
    expect(isFunction(store.unregister)).toBeTruthy();
  });

  it('测试 register,unregister 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    initModel(store);
    expect(() => store.register()).toThrow();
    expect(() => store.unregister()).toThrow();
  });

  it('测试 register,unregister 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    initModel(store);
    expect(
      store.register({
        namespace: 'agg',
        defaultState: undefined,
        reducers: {},
      })
    ).toBe(store);
    expect(store.unregister('agg')).toBe(store);
    expect(
      store.unregister({
        namespace: 'agg',
        reducers: {},
      })
    ).toBe(store);
  });
});
