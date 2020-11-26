/**
 * Generate unique id
 * @returns {string} - random id
 */
export function generateUId(): string {
  const fp = Date.now().toString(32);
  const sp = Math.round(Math.random() * 1024 * 1024).toString(32);
  return fp + '-' + sp;
}
