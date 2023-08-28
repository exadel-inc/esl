const SEQUENCE_KEY: unique symbol = ((window.Symbol || String)('__esl_sequences__')) as any;
const ns = window || global;
const sequences = ns[SEQUENCE_KEY] || new Map<string, number>();
ns[SEQUENCE_KEY] = sequences;

declare global {
  interface Window {
    [SEQUENCE_KEY]: Map<string, number>;
  }
}

/** Create and return sequential id */
export const sequentialUID = (name: string, prefix: string = name): string => {
  const uid = (sequences.get(name) || 0) + 1;
  sequences.set(name, uid);
  return prefix + uid;
};

/** Return random unique identifier */
export const randUID = (prefix: string = ''): string => {
  const time = Date.now().toString(32);
  const rand = Math.round(Math.random() * 1024 * 1024).toString(32);
  return prefix + time + '-' + rand;
};

/**
 * Generate unique id
 * @deprecated Alias for {@link randUID}
 */
export const generateUId = randUID;
