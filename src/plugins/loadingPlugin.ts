import { Plugin } from '../api/plugin';
import { Store } from '../api/store';
import { defineModel } from '../api/model';
import { createActionHelpers } from '../api/action';

export function loadingPlugin(namespace = 'loading'): Plugin {
  const loadingModel = defineModel({
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
  });
  const loadingActions = createActionHelpers(loadingModel);

  return function loadingPluginFn(store: Store): void {
    store.register(loadingModel).use(async (context, next) => {
      context.dispatch(loadingActions.begin(context));
      await next();
      context.dispatch(loadingActions.end(context));
    });
  };
}
