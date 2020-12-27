function randomString(): string {
  return Math.random().toString(36).substring(7).split('').join('.');
}

function generate(type: string): string {
  return `@@redux-agg/${type}__${randomString()}`;
}

export const MIDDLEWARE_GLOBAL_TYPE = generate('MIDDLEWARE_GLOBAL_TYPE');
export const REGISTER_MODEL_TYPE = generate('REGISTER_MODEL_TYPE');
export const UNREGISTER_MODEL_TYPE = generate('UNREGISTER_MODEL_TYPE');
