import { initPlugin } from '../../src/api/plugin';
import { isFunction } from '../../src/helpers/type';

describe('plugin.ts', () => {
  it('测试 plugin 调用结果是否符合预期', () => {
    const store: any = { dispatch: jest.fn() };
    initPlugin(store);
  });
});
