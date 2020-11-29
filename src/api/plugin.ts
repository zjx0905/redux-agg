import { assert } from '../helpers/assert';
import { isFunction } from '../helpers/type';
import { Payload } from './action';
import { State } from './model';
import { Store } from './store';

export interface Plugin<S extends State = State, P = Payload> {
  (store: Store<S, P>): void;
}

export interface InstallPlugin<S extends State = State, P = Payload> {
  (plugin: Plugin<S, P>): Store<S, P>;
}

export function initPlugin<S extends State = State, P = Payload>(
  store: Store<S, P>
): void {
  const cachePlugins = new Set<Plugin<S, P>>();

  store.plugin = function installPlugin(plugin: Plugin<S, P>): Store<S, P> {
    assert(isFunction(plugin), 'plugin 必须是一个函数');

    if (!cachePlugins.has(plugin)) {
      cachePlugins.add(plugin);

      plugin(store);
    }

    return store;
  };
}
