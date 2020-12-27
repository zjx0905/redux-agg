import { Plugin, Store, createActionHelpers } from 'redux-agg';
import { createLoadingModel } from './createLoadingModel';

export function loadingPlugin(namespace = 'loading'): Plugin {
  const model = createLoadingModel(namespace);
  const actions = createActionHelpers(model);
  return function loadingPluginCall(store: Store): void {
    store.register(model).use(async (context, next) => {
      context.dispatch(actions.begin(context));
      await next();
      context.dispatch(actions.end(context));
    });
  };
}
