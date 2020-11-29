# redux-agg

`redux-agg` 是一种数据流管理模式，它使您能够更方便的管理状态以及处理副作用，其本质是一个 [redux](https://github.com/reduxjs/redux) 辅助工具。

[![build status](https://travis-ci.com/zjx0905/redux-agg.svg?branch=master)](https://travis-ci.org/zjx0905/redux-agg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/zjx0905/redux-agg/badge.svg?branch=master)](https://coveralls.io/github/zjx0905/redux-agg?branch=master)
[![npm version](https://badge.fury.io/js/redux-agg.svg)](https://badge.fury.io/js/redux-agg)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

## 安装

```bash
$ yarn add redux-agg
```

或者

```bash
$ npm i redux-agg
```

- 支持 副作用。
- 支持 中间件。
- 支持 插件。

## 基础用法

```ts
interface ConnectState {
  counter: number;
}

const counterModel: Model<number, ConnectState> = {
  namespace: 'counter',
  defaultState: 0,
  reducers: {
    change(_, count) {
      return count;
    },
  },
  effects: {
    add(context, payload) {
      const count = context.getCurrentState();
      context.dispatch({
        type: 'change',
        payload: count + payload,
      });
    },
    minus(context, payload) {
      const count = context.getCurrentState();
      context.dispatch({
        type: 'change',
        payload: count - payload,
      });
    },
  },
};

const store = createAggStore<ConnectState>(createStore);
store.register(counterModel);

store.subscribe(() => {
  const state = store.getState();
  console.log('更新后的值：' + state.counter);
});

store.dispatch({
  type: 'counter/change',
  payload: 100,
});
store.dispatch({
  type: 'counter/add',
  payload: 100,
});
store.dispatch({
  type: 'counter/minus',
  payload: 100,
});
```

## 示例

[todomvc](https://github.com/zjx0905/redux-agg/examples/todomvc)
