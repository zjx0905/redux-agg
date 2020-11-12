import { isFunction } from '../../src/helpers/type';
import { createContext } from '../../src/model/context';

describe('context.ts', () => {
  it('创建 Context', () => {
    const store: any = { getState: () => {}, dispatch: () => {} };
    const action: any = {
      type: 'agg/action',
    };
    const context = createContext(store, action);
    expect(context.type).toBe('agg/action');
    expect(context.namespace).toBe('agg');
    expect(context.method).toBe('action');
    expect(context.payload).toBe(undefined);
    expect(isFunction(context.getState)).toBeTruthy();
    expect(isFunction(context.getCurrentState)).toBeTruthy();
    expect(isFunction(context.dispatch)).toBeTruthy();
  });

  it('创建 Context', () => {
    const store: any = { getState: () => {}, dispatch: () => {} };
    const action: any = {
      type: 'agg/action',
      payload: 1,
    };
    const context = createContext(store, action);
    expect(context.type).toBe('agg/action');
    expect(context.namespace).toBe('agg');
    expect(context.method).toBe('action');
    expect(context.payload).toBe(1);
    expect(isFunction(context.getState)).toBeTruthy();
    expect(isFunction(context.getCurrentState)).toBeTruthy();
    expect(isFunction(context.dispatch)).toBeTruthy();
  });
});
