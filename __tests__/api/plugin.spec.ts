import { initPlugin } from '../../src/api/plugin';
import { isFunction } from '../../src/helpers/type';

describe('plugin.ts', () => {
  it('测试 plugin 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    initPlugin(store);
    expect(isFunction(store.plugin)).toBeTruthy();
  });

  it('测试 store.plugin 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    initPlugin(store);
    expect(() => store.plugin()).toThrow();
  });

  it('测试 store.plugin 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    initPlugin(store);
    expect(store.plugin(() => {})).toBe(store);
  });
});
