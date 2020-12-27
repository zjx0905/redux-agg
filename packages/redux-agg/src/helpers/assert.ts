export function assert(succeed: boolean, message: string): void {
  if (!succeed) {
    throw new Error(`[redux-agg]: ${message}`);
  }
}
