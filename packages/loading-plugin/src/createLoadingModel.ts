import { Model } from 'redux-agg';

export function createLoadingModel(namespace: string): Model {
  return {
    namespace,
    defaultState: {
      global: false,
      models: {},
      effects: {},
    },
    reducers: {
      begin({ models, effects }, { type, namespace }) {
        return {
          global: true,
          models: {
            ...models,
            [namespace]: true,
          },
          effects: {
            ...effects,
            [type]: true,
          },
        };
      },
      end({ models, effects }, { type, namespace }) {
        return {
          global: false,
          models: {
            ...models,
            [namespace]: false,
          },
          effects: {
            ...effects,
            [type]: false,
          },
        };
      },
    },
  };
}
