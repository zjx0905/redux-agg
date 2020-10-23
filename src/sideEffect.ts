import { Action, AnyAction, Store } from "redux";
import {
  Context,
  createContext,
  createEffectContext,
  EffectContext,
  recoverContext,
} from "./context";
import { AggAction } from "./reaction";
import { createStack } from "./use";
import { assign, isPromise, isUndefined } from "./utils";

export interface AggEffect<D = any, S = any, P = any> {
  (context: EffectContext<D, S>, payload: P): Promise<void>;
}

export interface AggEffects<
  D = any,
  S = any,
  A extends Action<any> = AnyAction
> {
  [key: string]: AggEffect<D, S, A>;
}

export interface PerformerCallBack {
  (): Promise<void>;
}

const sideEffects = new Map();

function tryHitSideEffect(
  store: Store,
  aggAction: AggAction
): Promise<void> | void {
  const { namespace } = aggAction;

  const trySideEffect = sideEffects.get(namespace);
  if (!isUndefined(trySideEffect)) {
    return trySideEffect(store, aggAction);
  }
}

function createAggAction(action: AnyAction): AggAction {
  const { type, payload, ...other } = action;

  const [_namespace, _type] = type.split("/");
  const _payload = payload ? assign(other, payload) : other;

  return {
    namespace: _namespace,
    type: _type,
    payload: _payload,
  };
}

export function createEffectDispatch(store: Store) {
  return function effectDispatch<T extends AnyAction>(
    action: T
  ): Promise<T> | T {
    const aggAction = createAggAction(action);

    store.dispatch(aggAction);

    const ret = tryHitSideEffect(store, aggAction);

    return isPromise(ret) ? ret.then(() => action) : action;
  };
}

function asyncPerformer(
  context: Context,
  aggAction: AggAction,
  callback: PerformerCallBack
): Promise<void> {
  return Promise.resolve().then(() => {
    const stack = createStack(aggAction);

    function next() {
      const middleware = stack.shift();

      if (isUndefined(middleware)) {
        return callback();
      }

      return middleware(context, aggAction, next);
    }

    return next();
  });
}

export function buildSideEffect(namespace: string, effects: AggEffects) {
  function sideEffect(
    store: Store,
    aggAction: AggAction
  ): Promise<void> | void {
    const { namespace, type, payload } = aggAction;

    const effect = effects[type];

    if (!isUndefined(effect)) {
      const context = createContext(store);
      const effectContext = createEffectContext(namespace, store);

      return asyncPerformer(context, aggAction, () => {
        return effect(effectContext, payload);
      }).then(() => {
        recoverContext(context);
        recoverContext(effectContext);
      });
    }
  }

  sideEffects.set(namespace, sideEffect);
}
