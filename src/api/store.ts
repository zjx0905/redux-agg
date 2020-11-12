import { Store as ReduxStore, StoreCreator, StoreEnhancer } from 'redux';
import { isFunction } from '../helpers/type';
import { Action, Payload } from './action';
import { Dispatch, createDispatch } from './dispatch';
import { unused, UnusedMiddleware, use, UseMiddleware } from './middleware';
import {
  RegisterModel,
  UnregisterModel,
  register,
  unregister,
  State,
} from './model';
import { InstallPlugin, plugin } from './plugin';
import { reaction } from '../model/reducer';
import { assert } from '../helpers/assert';

export interface Store<S extends State = State, P = Payload>
  extends Pick<ReduxStore<S, Action<P>>, 'getState' | 'subscribe'> {
  dispatch: Dispatch;
  register: RegisterModel<S, P>;
  unregister: UnregisterModel<S, P>;
  use: UseMiddleware<S, P>;
  unused: UnusedMiddleware<S, P>;
  plugin: InstallPlugin<S, P>;
}

export function createAggStore<S extends State = State, P = Payload>(
  createStore: StoreCreator,
  enhancer?: StoreEnhancer<S, Action<P>>
): Store<S, P> {
  assert(isFunction(createStore), '创建 store 需要您传入 createStore 函数');

  const store = (isFunction(enhancer)
    ? enhancer(createStore)(reaction as any)
    : createStore(reaction as any)) as any;
  createDispatch(store);
  register(store);
  unregister(store);
  use(store);
  unused(store);
  plugin(store);
  return store;
}
