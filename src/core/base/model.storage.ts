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

  protected static readonly EXPIRATION_TIME = 3600000 * 12; // 12 hours

  private static instances = new Map<string, UIPStateStorage>();

  protected constructor(protected storeKey: string, protected model: UIPStateModel) {}

  public static for(storeKey: string, model: UIPStateModel): UIPStateStorage {
    const instance = this.instances.get(storeKey);
    if (instance) return instance;

    const newInstance = new UIPStateStorage(storeKey, model);
    this.instances.set(storeKey, newInstance);
    return newInstance;
  }

  protected loadEntry(key: string): string | null {
    const entry = (this.lsGet()[key] || {}) as UIPStateStorageEntry;
    if (parseInt(entry?.ts, 10) + UIPStateStorage.EXPIRATION_TIME > Date.now()) return entry.snippets || null;
    this.removeEntry(key);
    return null;
  }

  protected saveEntry(key: string, value: string): void {
    this.lsSet(Object.assign(this.lsGet(), {[key]: {ts: Date.now(), snippets: value}}));
  }

  protected removeEntry(key: string): void {
    const data = this.lsGet();
    delete data[key];
    this.lsSet(data);
  }

  protected lsGet(): Record<string, any> {
    return JSON.parse(localStorage.getItem(UIPStateStorage.STORAGE_KEY) || '{}');
  }

  protected lsSet(value: Record<string, any>): void {
    localStorage.setItem(UIPStateStorage.STORAGE_KEY, JSON.stringify(value));
  }

  protected getStateKey(): string | null {
    const {activeSnippet} = this.model;
    if (!activeSnippet) return null;
    return JSON.stringify({key: this.storeKey, snippet: activeSnippet.html});
  }

  public loadState(): UIPStateModelSnippets | undefined {
    const stateKey = this.getStateKey();
    const state = stateKey && this.loadEntry(stateKey);
    if (state) return JSON.parse(state);
  }

  public saveState(): void {
    const {js, html, note} = this.model;
    const stateKey = this.getStateKey();
    stateKey && this.saveEntry(stateKey, JSON.stringify({js, html, note}));
  }

  public resetState(): void {
    const stateKey = this.getStateKey();
    stateKey && this.removeEntry(stateKey);
  }
}
