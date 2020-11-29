import { Store as ReduxStore, StoreCreator, StoreEnhancer } from 'redux';
import { isFunction } from '../helpers/type';
import { Action, Payload } from './action';
import { Dispatch, createDispatch } from './dispatch';
import {
  UnusedEffectMiddleware,
  UseEffectMiddleware,
  initEffectMiddleware,
} from './effectMiddleware';
import { RegisterModel, UnregisterModel, State, initModel } from './model';
import { InstallPlugin, initPlugin } from './plugin';
import { updateState } from '../model/reducer';
import { assert } from '../helpers/assert';

export interface Store<S extends State = State, P = Payload>
  extends Pick<ReduxStore<S, Action<P>>, 'getState' | 'subscribe'> {
  dispatch: Dispatch;
  register: RegisterModel<S, P>;
  unregister: UnregisterModel<S, P>;
  use: UseEffectMiddleware<S, P>;
  unused: UnusedEffectMiddleware<S, P>;
  plugin: InstallPlugin<S, P>;
}

export function createAggStore<S extends State = State, P = Payload>(
  createStore: StoreCreator,
  enhancer?: StoreEnhancer<S, Action<P>>
): Store<S, P> {
  assert(isFunction(createStore), '创建 store 需要您传入 createStore 函数');

  const store = (isFunction(enhancer)
    ? enhancer(createStore)(updateState as any)
    : createStore(updateState as any)) as any;
  createDispatch(store);
  initModel(store);
  initEffectMiddleware(store);
  initPlugin(store);
  return store;
}
