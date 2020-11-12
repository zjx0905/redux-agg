import { isModel, isString } from '../helpers/type';
import { REGISTER_MODEL_TYPE, UNREGISTER_MODEL_TYPE } from '../helpers/strings';
import {
  EffectsObject,
  increasedSideEffects,
  reduceSideEffects,
} from '../model/effect';
import { ReducersObject, recede, enhance } from '../model/reducer';
import { Store } from './store';
import { assert } from '../helpers/assert';
import { Payload } from './action';

export interface State {
  [extraProps: string]: any;
}

export interface Model<SS = any, S extends State = State, P = Payload> {
  namespace: string;
  defaultState: SS;
  reducers: ReducersObject<SS, P>;
  effects?: EffectsObject<SS, S, P>;
}

/**
 * 注册 model
 * ```ts
 * store.register({
 *   namespace: 'todos',
 *   defaultState: [],
 *   reducers: {
 *     add(state, payload) {
 *       return [payload, ...state];
 *     }
 *   }
 * })
 * ```
 */
export interface RegisterModel<S extends State = State, P = Payload> {
  <SS = any>(model: Model<SS, S, P>): Store<S, P>;
}

export interface UnregisterModel<S extends State = State, P = Payload> {
  <SS = any>(namespace: string): Store<S, P>;
  <SS = any>(model: Model<SS, S, P>): Store<S, P>;
}

export function defineModel<SS = any, S extends State = State, P = Payload>(
  model: Model<SS, S, P>
): Model<SS, S, P> {
  return model;
}

export function register<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  store.register = function registerModel<SS = any>(
    model: Model<SS, S, P>
  ): Store<S, P> {
    assert(isModel(model), '注册 model 需要您提供正确格式的 model。');

    enhance(model);
    increasedSideEffects(model);
    store.dispatch({
      type: REGISTER_MODEL_TYPE,
    });
    return store;
  };
}

export function unregister<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  store.unregister = function unregisterModel<SS = any>(
    namespaceOrModel: string | Model<SS, S, P>
  ): Store<S, P> {
    if (!isString(namespaceOrModel)) {
      return unregisterModel(namespaceOrModel.namespace);
    }

    assert(
      isString(namespaceOrModel),
      '注销 model 需要您提供字符型的 namespace。'
    );

    recede(namespaceOrModel);
    reduceSideEffects(namespaceOrModel);
    store.dispatch({
      type: UNREGISTER_MODEL_TYPE,
    });
    return store;
  };
}
