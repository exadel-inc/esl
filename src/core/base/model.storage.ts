import type {UIPStateModel} from './model';
import type {UIPPlugin} from './plugin';
import type {UIPRoot} from './root';

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

  public constructor(protected storeKey: string, protected model: UIPStateModel) {}

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
    if (!activeSnippet || !this.storeKey) return null;
    return JSON.stringify({key: this.storeKey, snippet: activeSnippet.html});
  }

  public loadState(initiator: UIPPlugin | UIPRoot): void {
    const stateKey = this.getStateKey();
    const state = stateKey && this.loadEntry(stateKey);
    if (!state) return; 
    
    const stateobj = JSON.parse(state);
    this.model.setHtml(stateobj.html, initiator, true);
    this.model.setJS(stateobj.js, initiator);
    this.model.setNote(stateobj.note, initiator);
  }

  public saveState(): void {
    const stateKey = this.getStateKey();
    const {js, html, note} = this.model;
    stateKey && this.saveEntry(stateKey, JSON.stringify({js, html, note}));
  }

  public resetState(source: 'js' | 'html', modifier: UIPPlugin | UIPRoot): void {
    const stateKey = this.getStateKey();
    stateKey && this.removeEntry(stateKey);

    this.model.resetSnippet(source, modifier);
  }
}
