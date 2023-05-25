/**
 * Converts relative URL to absolute URL based on the base URL.
 * @param relative - relative URL
 * @param base - base URL (document.baseURI by default)
 **/
export function toAbsoluteUrl(relative: string, base: string = document.baseURI): string {
  return new URL(relative, base).href;
}
