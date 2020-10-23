import { Store } from "redux";
import { REGISTER_MODEL_TYPE } from "./strings";
import { AggReducers, synthetic } from "./reaction";
import { AggEffects, buildSideEffect } from "./sideEffect";
import { isUndefined } from "./utils";

export interface Model<D = any, S = any> {
  namespace: string;
  defaultState: any;
  effects?: AggEffects<D, S>;
  reducers: AggReducers<D>;
}

export interface RegisterModel {
  <D = any, S = any>(model: Model<D, S>): void;
}

export default function model(store: Store): RegisterModel {
  return function registerModel<D = any, S = any>(model: Model<D, S>): void {
    const { namespace, defaultState, effects, reducers } = model;

    synthetic(namespace, defaultState, reducers);

    if (!isUndefined(effects)) {
      buildSideEffect(namespace, effects);
    }

    store.dispatch({
      type: REGISTER_MODEL_TYPE,
    });
  };
}
