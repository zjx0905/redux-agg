import { use, unused } from '../../src/api/middleware';
import { isFunction } from '../../src/helpers/type';

describe('middleware.ts', () => {
  it('测试 use 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    use(store);
    expect(isFunction(store.use)).toBeTruthy();
  });

  it('测试 store.use 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    use(store);
    expect(() => store.use()).toThrow();
    expect(() => store.use('agg')).toThrow();
  });

  it('测试 store.use 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    use(store);
    expect(store.use(() => {})).toBe(store);
    expect(store.use('agg', () => {})).toBe(store);
  });

  it('测试 unused 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    unused(store);
    expect(isFunction(store.unused)).toBeTruthy();
  });

  it('测试 store.unused 参数检查是否成功', () => {
    const store: any = { dispatch: jest.fn() };
    unused(store);
    expect(() => store.unused()).toThrow();
    expect(() => store.unused('agg')).toThrow();
  });

  it('测试 store.unused 返回值是否正确', () => {
    const store: any = { dispatch: jest.fn() };
    unused(store);
    expect(store.unused(() => {})).toBe(store);
    expect(store.unused('agg', () => {})).toBe(store);
  });
});
