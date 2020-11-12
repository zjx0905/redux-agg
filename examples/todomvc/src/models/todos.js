import { defineModel, createActionHelpers } from 'redux-agg';

export const todosModel = defineModel({
  namespace: 'todos',
  defaultState: [
    {
      text: 'Use Redux Agg',
      completed: false,
      id: 0,
    },
  ],
  reducers: {
    add(state, text) {
      return [
        ...state,
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text,
        },
      ];
    },
    delete(state, id) {
      return state.filter((todo) => todo.id !== id);
    },
    edit(state, currentTodo) {
      return state.map((todo) =>
        todo.id === currentTodo.id ? { ...todo, text: currentTodo.text } : todo
      );
    },
    complete(state, id) {
      return state.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    },
    completeAll(state) {
      const areAllMarked = state.every((todo) => todo.completed);
      return state.map((todo) => ({
        ...todo,
        completed: !areAllMarked,
      }));
    },
    clearCompleted(state) {
      return state.filter((todo) => todo.completed === false);
    },
  },
});

export const todosActions = createActionHelpers(todosModel);
