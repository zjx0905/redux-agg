import {
  MIDDLEWARE_GLOBAL_TYPE,
  REGISTER_MODEL_TYPE,
  UNREGISTER_MODEL_TYPE,
} from '../../src/helpers/strings';
import { isString } from '../../src/helpers/type';

describe('strings.ts', () => {
  it('MIDDLEWARE_GLOBAL_TYPE', () => {
    expect(isString(MIDDLEWARE_GLOBAL_TYPE)).toBeTruthy();
  });

  it('REGISTER_MODEL_TYPE', () => {
    expect(isString(REGISTER_MODEL_TYPE)).toBeTruthy();
  });
  it('UNREGISTER_MODEL_TYPE', () => {
    expect(isString(UNREGISTER_MODEL_TYPE)).toBeTruthy();
  });
});
