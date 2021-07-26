const shortcuts = new Map<string, string | boolean>();

export class ESLMediaShortcuts {
  // For debug purposes
  private static readonly _shortcuts = shortcuts;

  public static add(shortcut: string, value: string | boolean) {
    if (!['boolean', 'string'].includes(typeof value)) value = false;
    return shortcuts.set(shortcut.toLowerCase(), value);
  }

  public static remove(shortcut: string) {
    return shortcuts.delete(shortcut.toLowerCase());
  }

  public static replace(match: string) {
    if (shortcuts.has(match)) return shortcuts.get(match);
  }
}
