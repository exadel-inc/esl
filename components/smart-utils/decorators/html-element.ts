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

    get el(): T | null {
        this._query = this._getQuery();

        let element: T = this._cache.has(this._query) ? this._cache.get(this._query)[0] : null;
        if (!this._cache.has(this._query)) {
            element = findTarget(this._query, this._targetInstance) as T;
            if (this._cacheable && element) this._cache.set(this._query, [element]);
        }

        return element;
    }

    get els(): T[] {
        this._query = this._getQuery();
        let elements: any = [];
        const queries = this._query.split(',');

        queries.forEach((query) => {
            if (this._cache.has(query.trim())) {
                elements = elements.concat(this._cache.get(query));
            } else {
                const tmpElements: T[] = findTarget(query, this._targetInstance, true) as T[] || [];
                elements = elements.concat(tmpElements instanceof HTMLElement
                    ? [tmpElements]
                    : Array.from(tmpElements));
                if (this._cacheable && tmpElements.length > 0) this._cache.set(query, tmpElements);
            }
        })

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
