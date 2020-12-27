import {
  isFunction,
  isString,
  isPromise,
  isUndefined,
  isPlainObject,
  isModel,
} from '../../src/helpers/type';

describe('type.ts', () => {
  it('isFunction', () => {
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction(0)).toBeFalsy();
    expect(isFunction('')).toBeFalsy();
    expect(isFunction({})).toBeFalsy();
    expect(isFunction([])).toBeFalsy();
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction(async () => {})).toBeTruthy();
    expect(isFunction((async () => {})())).toBeFalsy();
    expect(isFunction(new Promise(() => {}))).toBeFalsy();
  });

  it('isString', () => {
    expect(isString(null)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(0)).toBeFalsy();
    expect(isString('')).toBeTruthy();
    expect(isString({})).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString(() => {})).toBeFalsy();
    expect(isString(async () => {})).toBeFalsy();
    expect(isString((async () => {})())).toBeFalsy();
    expect(isString(new Promise(() => {}))).toBeFalsy();
  });

  it('isPromise', () => {
    expect(isPromise(null)).toBeFalsy();
    expect(isPromise(undefined)).toBeFalsy();
    expect(isPromise(0)).toBeFalsy();
    expect(isPromise('')).toBeFalsy();
    expect(isPromise({})).toBeFalsy();
    expect(isPromise([])).toBeFalsy();
    expect(isPromise(() => {})).toBeFalsy();
    expect(isPromise(async () => {})).toBeFalsy();
    expect(isPromise((async () => {})())).toBeTruthy();
    expect(isPromise(new Promise(() => {}))).toBeTruthy();
  });

  it('isUndefined', () => {
    expect(isUndefined(null)).toBeFalsy();
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(0)).toBeFalsy();
    expect(isUndefined('')).toBeFalsy();
    expect(isUndefined({})).toBeFalsy();
    expect(isUndefined([])).toBeFalsy();
    expect(isUndefined(() => {})).toBeFalsy();
    expect(isUndefined(async () => {})).toBeFalsy();
    expect(isUndefined((async () => {})())).toBeFalsy();
    expect(isUndefined(new Promise(() => {}))).toBeFalsy();
  });

  it('isPlainObject', () => {
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(undefined)).toBeFalsy();
    expect(isPlainObject(0)).toBeFalsy();
    expect(isPlainObject('')).toBeFalsy();
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject([])).toBeFalsy();
    expect(isPlainObject(() => {})).toBeFalsy();
    expect(isPlainObject(async () => {})).toBeFalsy();
    expect(isPlainObject((async () => {})())).toBeFalsy();
    expect(isPlainObject(new Promise(() => {}))).toBeFalsy();
  });

  it('isModel', () => {
    expect(isModel(null)).toBeFalsy();
    expect(isModel(undefined)).toBeFalsy();
    expect(isModel(0)).toBeFalsy();
    expect(isModel('')).toBeFalsy();
    expect(isModel({})).toBeFalsy();
    expect(isModel([])).toBeFalsy();
    expect(isModel(() => {})).toBeFalsy();
    expect(isModel(async () => {})).toBeFalsy();
    expect(isModel((async () => {})())).toBeFalsy();
    expect(isModel(new Promise(() => {}))).toBeFalsy();
    expect(isModel({ namespace: '' })).toBeFalsy();
    expect(isModel({ reducers: '' })).toBeFalsy();
    expect(isModel({ namespace: '', reducers: {} })).toBeTruthy();
  });
});
