const SEQUENCE_KEY: unique symbol = Symbol.for('__esl_sequences');
const sequenceHost = globalThis as any;
const sequences = sequenceHost[SEQUENCE_KEY] || new Map<string, number>();
sequenceHost[SEQUENCE_KEY] = sequences;

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
