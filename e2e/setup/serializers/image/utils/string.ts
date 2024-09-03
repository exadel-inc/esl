export const toKebabCase = (str: string): string => str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
