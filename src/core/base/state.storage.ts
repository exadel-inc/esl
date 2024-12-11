import type {UIPStateModel} from './model';
import type {UIPRoot} from './root';
import type {UIPEditableSource} from './source';

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

  protected model: UIPStateModel;

  public constructor(protected storeKey: string, protected root: UIPRoot) {
    this.model = root.model;
    this.addEventListeners();
  }

  protected addEventListeners(): void {
    this.model.addEventListener('uip:model:change', () => this.saveState());
    this.model.addEventListener('uip:model:snippet:change', () => this.loadState());
  }

  protected loadEntry(key: string): string | null {
    const entry = (this.lsState[key] || {}) as UIPStateStorageEntry;
    if (parseInt(entry?.ts, 10) + UIPStateStorage.EXPIRATION_TIME > Date.now()) return entry.snippets || null;
    this.removeEntry(key);
    return null;
  }

  protected saveEntry(key: string, value: string): void {
    this.lsState = Object.assign(this.lsState, {[key]: {ts: Date.now(), snippets: value}});
  }

  protected removeEntry(key: string): void {
    const data = this.lsState;
    delete this.lsState[key];
    this.lsState = data;
  }

  protected get lsState(): Record<string, any> {
    return JSON.parse(localStorage.getItem(UIPStateStorage.STORAGE_KEY) || '{}');
  }
  
  protected set lsState(value: Record<string, any>) {
    localStorage.setItem(UIPStateStorage.STORAGE_KEY, JSON.stringify(value));
  }

  protected getStateKey(): string | null {
    const {activeSnippet} = this.model;
    if (!activeSnippet || !this.storeKey) return null;
    return JSON.stringify({key: this.storeKey, snippet: activeSnippet.html});
  }

  public loadState(): void {
    const stateKey = this.getStateKey();
    const state = stateKey && this.loadEntry(stateKey);
    if (!state) return; 
    
    const stateobj = JSON.parse(state) as UIPStateModelSnippets;
    this.model.setHtml(stateobj.html, this.root, true);
    this.model.setJS(stateobj.js, this.root);
    this.model.setNote(stateobj.note, this.root);
  }

  public saveState(): void {
    const stateKey = this.getStateKey();
    const {js, html, note} = this.model;
    stateKey && this.saveEntry(stateKey, JSON.stringify({js, html, note}));
  }

  public resetState(source: UIPEditableSource): void {
    const stateKey = this.getStateKey();
    stateKey && this.removeEntry(stateKey);

    this.model.reset(source, this.root);
  }
}
