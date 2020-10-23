const randomString = () =>
  Math.random().toString(36).substring(7).split("").join(".");

function generate(type: string): string {
  return `@@agg/${type}__${randomString()}`;
}

export const MIDDLEWARE_GLOBAL_KEY = generate("MIDDLEWARE_GLOBAL_KEY");

export const REGISTER_MODEL_TYPE = generate("REGISTER_MODEL_TYPE");
