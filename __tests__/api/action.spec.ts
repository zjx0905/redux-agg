import { createActionCreator, createActionHelpers } from '../../src/api/action';
import { isFunction } from '../../src/helpers/type';

describe('action.ts', () => {
  it('createActionCreator', () => {
    const createAction = createActionCreator('agg');
    expect(isFunction(createAction)).toBeTruthy();
    const action1 = createAction('action1');
    expect(action1).toEqual({
      type: 'agg/action1',
    });
    const action2 = createAction('action2', 1);
    expect(action2).toEqual({
      type: 'agg/action2',
      payload: 1,
    });
  });

  it('createActionHelpers', () => {
    const actions1 = createActionHelpers({
      namespace: 'agg',
      defaultState: undefined,
      reducers: {
        add() {},
        remove() {},
      },
    });
    expect(isFunction(actions1.add)).toBeTruthy();
    expect(isFunction(actions1.remove)).toBeTruthy();
    const actions2 = createActionHelpers({
      namespace: 'agg',
      defaultState: undefined,
      reducers: {
        fetch() {},
        save() {},
      },
      effects: {
        async fatch() {},
      },
    });
    expect(actions2.fetch()).toEqual({
      type: 'agg/fetch',
    });
    expect(actions2.save(1)).toEqual({
      type: 'agg/save',
      payload: 1,
    });
  });
});
