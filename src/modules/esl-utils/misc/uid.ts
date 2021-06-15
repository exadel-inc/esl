const sequences = new Map<string, number>();

/** Create and return sequential id */
export const sequentialUID = (name: string, prefix: string = name) => {
  const uid = (sequences.get(name) || 0) + 1;
  sequences.set(name, uid);
  return prefix + uid;
};

/**
 * Reset {@link sequentialUID} generator.
 * @deprecated avoid reset of globally shared sequences
 */
export const resetSequentialUID = (name?: string) => {
  if (typeof name === 'string') {
    sequences.delete(name);
  } else {
    sequences.clear();
  }
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
