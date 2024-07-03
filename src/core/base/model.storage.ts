import type {UIPStateModel} from './model';

interface UIPStateStorageEntry {
  ts: string;
  snippets: string;
}

interface UIPStateModelSnippets {
  js: string;
  html: string;
  note: string;
}

export class UIPStateStorage {
  public static readonly STORAGE_KEY = 'uip-editor-storage';

  public constructor(protected model: UIPStateModel) {}

  protected static loadEntry(key: string): string | null {
    const entry = (this.lsGet()[key] || {}) as UIPStateStorageEntry;
    const expirationTime = 3600000 * 12;
    if (parseInt(entry?.ts, 10) + expirationTime > Date.now()) return entry.snippets || null;
    this.removeEntry(key);
    return null;
  }

  protected static saveEntry(key: string, value: string): void {
    this.lsSet(Object.assign(this.lsGet(), {[key]: {ts: Date.now(), snippets: value}}));
  }

  protected static removeEntry(key: string): void {
    const data = this.lsGet();
    delete data[key];
    this.lsSet(data);
  }

  protected static lsGet(): Record<string, any> {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  protected static lsSet(value: Record<string, any>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
  }

  protected getStateKey(): string | null {
    if (!this.model?.activeSnippet) return null;
    const {id, activeSnippet} = this.model;
    return JSON.stringify({id, path: location.pathname, snippet: activeSnippet.html});
  }

  public loadState(): UIPStateModelSnippets | undefined {
    const key = this.getStateKey();
    const state = key && UIPStateStorage.loadEntry(key);
    if (state) return JSON.parse(state);
  }

  public saveState(): void {
    const {js, html, note} = this.model;
    const key = this.getStateKey();
    key && UIPStateStorage.saveEntry(key, JSON.stringify({js, html, note}));
  }
}
