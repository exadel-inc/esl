import {findTarget} from '../dom/traversing'

interface ElementDescriptor {
    via: string;
    cache?: boolean;
}

export class ElementTarget<T extends HTMLElement> {
    private _cache: Map<string, T[]>;
    public _query: string;

    private readonly _targetInstance: any;
    private readonly _targetProperty: string;
    private readonly _cacheable: boolean;

    constructor(via: string, cache: boolean, instance: T) {
        this._targetProperty = via;
        this._cacheable = cache;
        this._targetInstance = instance;
        this._cache = new Map();
        this._query = '';
    }

    private _getQuery(): string {
        return this._targetProperty ? (this._targetInstance)[this._targetProperty] : '';
    }

    private _getElement(query: string, multiply: boolean): T | T[] | null  {
        let element: T | T[] = null;
        if (this._cache.has(query)) {
            element = multiply ? this._cache.get(query) : this._cache.get(query)[0];
        }

        if (!this._cache.has(query)) {
            element = findTarget(query, this._targetInstance, multiply) as T | T[] | null;
            const isList: boolean = NodeList.prototype.isPrototypeOf(element);
            if (element && multiply) isList ? element = Array.from(element as T[]) : element = [element as T];
            if (element && this._cacheable) this._cache.set(query, multiply ? (element as T[]) : [element as T]);
        }

        return element;
    }

    get el(): T | null {
        this._query = this._getQuery();
        return (this._getElement(this._query, false) as T | null);
    }

    get els(): T[] {
        this._query = this._getQuery();
        let elements: T[] = [];
        this._query
            .split(',')
            .forEach((query) => {
                elements = elements.concat(this._getElement(query, true) as T[])
            });
        return elements;
    }

    public refreshCache(query?: string): void {
        if (!query) this._cache.clear();
        else if (this._cache.has(query)) {
            this._cache.delete(query);
        }
    }
}

export const htmlElement = (config: ElementDescriptor = {via: '', cache: false}) => {
    return (target: object, propertyName: string) => {
        function get() {
            Object.defineProperty(this, propertyName, {value: new ElementTarget(config.via, config.cache, this)});
            return this[propertyName];
        }

        Object.defineProperty(target, propertyName, {get});
    };
};
