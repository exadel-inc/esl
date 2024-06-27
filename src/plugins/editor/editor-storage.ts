interface EditorStorageEntry {
  ts: string;
  data: string;
}

export class EditorStorage {
  public static readonly STORAGE_KEY = 'uip-editor-storage';

  protected static get(): Record<string, any> {
    return JSON.parse(localStorage.getItem(EditorStorage.STORAGE_KEY) || '{}');
  }

  protected static set(value: Record<string, any>): void {
    localStorage.setItem(EditorStorage.STORAGE_KEY, JSON.stringify(value));
  }

  protected static serializeWithPathname(key: string): string {
    return JSON.stringify({path: location.pathname, key});
  }

  public static save(key: string, value: string): void {
    const state = {[EditorStorage.serializeWithPathname(key)]: {ts: Date.now(), value}};
    EditorStorage.set(Object.assign(EditorStorage.get(), state));
  }

  public static load(key: string): string | null {
    const entry = EditorStorage.get()[EditorStorage.serializeWithPathname(key)] || {} as EditorStorageEntry;
    const expirationTime = 3600000 * 12;
    if (entry?.ts + expirationTime > Date.now()) return entry.value || null;
    EditorStorage.remove(key);
    return null;
  }

  public static remove(key: string): void {
    const data = EditorStorage.get();
    delete data[key];
    EditorStorage.set(data);
  }
}
