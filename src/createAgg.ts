import {
  Action,
  AnyAction,
  Reducer,
  Store,
  StoreCreator,
  StoreEnhancer,
} from "redux";
import { createEffectDispatch } from "./sideEffect";
import { respond } from "./reaction";
import model, { RegisterModel } from "./model";
import use, { Use } from "./use";
import { assign, isFunction } from "./utils";

export interface AggStore<S = any, A extends Action = AnyAction>
  extends Store<S, A> {
  model: RegisterModel;
  use: Use<S, A>;
}

export interface AggStoreCreator<S = any, A extends Action = AnyAction> {
  (enhancer?: StoreEnhancer): AggStore<S, A>;
}

export default function createAgg<S = any, A extends Action = AnyAction>(
  createStore: StoreCreator
): AggStoreCreator<S, A> {
  const createAggStore: StoreCreator = (reducer: Reducer) => {
    const store = createStore(reducer);

    const effectDispatch = createEffectDispatch(store);
    const registerModel = model(store);

    return assign(store, {
      dispatch: effectDispatch,
      model: registerModel,
      use,
    });
  };

  return function createStore(enhancer?: StoreEnhancer): AggStore<S, A> {
    const aggStore = isFunction(enhancer)
      ? enhancer(createAggStore)(respond)
      : createAggStore(respond);

    return aggStore as any;
  };
}
