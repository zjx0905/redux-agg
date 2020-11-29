import { initEffectMiddleware } from '../../src/api/effectMiddleware';
import { isFunction } from '../../src/helpers/type';

describe('middleware.ts', () => {
  it('测试 initEffectMiddleware 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    initEffectMiddleware(store);
    expect(isFunction(store.use)).toBeTruthy();
    expect(isFunction(store.unused)).toBeTruthy();
  });

  it('测试 use,unused 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    initEffectMiddleware(store);
    expect(() => store.use()).toThrow();
    expect(() => store.use('agg')).toThrow();
    expect(() => store.unused()).toThrow();
    expect(() => store.unused('agg')).toThrow();
  });

  it('测试 use,unused 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    initEffectMiddleware(store);
    expect(store.use(() => {})).toBe(store);
    expect(store.use('agg', () => {})).toBe(store);
    expect(store.unused(() => {})).toBe(store);
    expect(store.unused('agg', () => {})).toBe(store);
  });
});
