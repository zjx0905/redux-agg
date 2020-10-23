import { Action, Dispatch, Store } from "redux";
import { AggAction } from "./reaction";
import { create, keys } from "./utils";

interface AnyContext {
  [key: string]: any;
}

export interface Context<S = any, A extends Action<any> = AggAction>
  extends Pick<Store<S, A>, "getState" | "dispatch"> {}

export interface EffectContext<
  D = any,
  S = any,
  A extends Action<any> = AggAction
> extends Context<S, A> {
  getCurrentState: () => D;
  currentDispatch: Dispatch<A>;
}

const CONTEXT_POOL_MAX_SIZE = 10;

const contextPool: AnyContext[] = [];

function provideContext(): AnyContext {
  return contextPool.shift() ?? create();
}

export function recoverContext(context: AnyContext): void {
  if (
    contextPool.length >= CONTEXT_POOL_MAX_SIZE ||
    contextPool.indexOf(context) !== -1
  ) {
    return;
  }

  keys(context).forEach((key) => {
    context[key] = undefined;
  });
  contextPool.push(context);
}

export function createContext(store: Store): Context {
  const context = provideContext() as Context;

  context.getState = store.getState;
  context.dispatch = store.dispatch;
  return context;
}

export function createEffectContext(
  namespace: string,
  store: Store
): EffectContext {
  const context = createContext(store) as EffectContext;

  context.getCurrentState = function getCurrentState() {
    const state = context.getState();
    return state[namespace];
  };
  context.currentDispatch = function currentDispatch(action) {
    return context.dispatch({
      ...action,
      type: `${namespace}/${action.type}`,
    });
  };
  return context;
}
