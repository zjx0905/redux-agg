import { createStore } from 'redux';
import { createAggStore } from '../../src/api/store';

describe('store.ts', () => {
  it('测试 createAggStore 调用结果是否符合预期', () => {
    expect(() => (createAggStore as any)()).toThrow();
    const createStore1 = jest.fn();
    try {
      createAggStore({
        createStore: createStore1,
      });
    } catch {}
    expect(createStore1).toBeCalled();
    const createStore2 = jest.fn();
    const enhancer = jest.fn((c) => c());
    try {
      createAggStore({
        createStore: createStore2,
        enhancer,
      });
    } catch {}
    expect(createStore2).toBeCalled();
    expect(enhancer).toBeCalled();
  });

  it('测试初始化状态是否正确', () => {
    const store = createAggStore({
      createStore,
    });
    expect(store.getState()).toEqual({});
  });

  it('测试注册 model 后状态是否正确', () => {
    const store = createAggStore({
      createStore,
    });
    store.register({
      namespace: 'agg',
      defaultState: 0,
      reducers: {},
    });
    expect(store.getState()).toEqual({ agg: 0 });
  });

  it('测试注销 model 后状态是否正确', () => {
    const store = createAggStore({
      createStore,
    });
    store.unregister({
      namespace: 'agg',
      defaultState: 0,
      reducers: {},
    });
    expect(store.getState()).toEqual({});
  });

  it('测试 dispatch 错误的 action 不应该终端程序的执行', () => {
    const store: any = createAggStore({
      createStore,
    });
    const action = store.dispatch(0);
    expect(action).toBe(0);
  });

  it('测试 render 结果是否正确', () => {
    const store = createAggStore({
      createStore,
    });
    store.register({
      namespace: 'agg',
      defaultState: 0,
      reducers: {
        change(_, payload) {
          return payload;
        },
      },
    });
    expect(store.getState()).toEqual({ agg: 0 });
    store.dispatch({
      type: 'agg/change',
      payload: 1,
    });
    expect(store.getState()).toEqual({ agg: 1 });
    store.unregister('agg');
  });

  it('测试 effect 结果是否正确', async () => {
    const store = createAggStore({
      createStore,
    });
    store.register({
      namespace: 'agg',
      defaultState: 0,
      reducers: {
        change(_, payload) {
          return payload;
        },
      },
      effects: {
        async asyncChange(context, payload) {
          expect(context.getCurrentState()).toEqual(0);

          context.dispatch({
            type: 'change',
            payload,
          });
        },
      },
    });
    expect(store.getState()).toEqual({ agg: 0 });
    await store.dispatch({
      type: 'agg/asyncChange',
      payload: 1,
    });
    expect(store.getState()).toEqual({ agg: 1 });
    store.unregister('agg');
  });

  it('测试当前 model.effect 中触发其他 model.effect 结果是否正确', async () => {
    const store = createAggStore({
      createStore,
    });
    store
      .register({
        namespace: 'agg1',
        defaultState: 0,
        reducers: {
          change(_, payload) {
            return payload;
          },
        },
        effects: {
          async asyncChange(context, payload) {
            context.dispatch({
              type: 'change',
              payload,
            });
          },
        },
      })
      .register({
        namespace: 'agg2',
        defaultState: 0,
        reducers: {
          change(_, payload) {
            return payload;
          },
        },
        effects: {
          async asyncChange(context, payload) {
            await context.dispatch({
              type: 'agg1/asyncChange',
              payload,
            });
            context.dispatch({
              type: 'change',
              payload,
            });
          },
        },
      });
    expect(store.getState()).toEqual({ agg1: 0, agg2: 0 });
    await store.dispatch({
      type: 'agg2/asyncChange',
      payload: 2,
    });
    expect(store.getState()).toEqual({ agg1: 2, agg2: 2 });
    store.unregister('agg1').unregister('agg2');
  });
});
