// import { createStore } from 'redux';
import { loadingPlugin } from '../../src/plugins/loadingPlugin';
import { isFunction } from '../../src/helpers/type';
// import { createAggStore } from '../../src/api/store';

describe('loadingPlugin.ts', () => {
  it('测试 loadingPlugin 调用是否符合预期', () => {
    const loading = loadingPlugin();
    expect(isFunction(loading)).toBeTruthy();
    const store: any = {
      register: jest.fn(() => store),
      use: jest.fn(),
    };
    loading(store);
    expect(store.register).toBeCalled();
    expect(store.use).toBeCalled();
  });
});
