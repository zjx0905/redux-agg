import { createStore } from 'redux';
import { createAggStore, createActionHelpers } from 'redux-agg';
import { todosModel } from './todos';
import { visibilityFilterModel } from './visibilityFilter';

export const todosActions = createActionHelpers(todosModel);

export const visibilityFilterActions = createActionHelpers(
  visibilityFilterModel
);

export const store = createAggStore(createStore)
  .register(todosModel)
  .register(visibilityFilterModel);
