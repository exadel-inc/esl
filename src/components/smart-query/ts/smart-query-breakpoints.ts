class ScreenBreakpoint {

	public min: number;
	public max: number;

	constructor(min: number, max: number) {
		this.min = min;
		this.max = max;
	}

	get mediaQuery(): string {
		return `(min-width: ${this.min}px) and (max-width: ${this.max}px)`;
	}

	get mediaQueryGE(): string {
		return `(min-width: ${this.min}px)`;
	}

	get mediaQueryLE(): string {
		return `(max-width: ${this.max}px)`;
	}
}

type BreakpoinsMapping = {
	[key: string]: ScreenBreakpoint
};

const registry: BreakpoinsMapping = {
	xs: new ScreenBreakpoint(1, 767),
	sm: new ScreenBreakpoint(768, 991),
	md: new ScreenBreakpoint(992, 1199),
	lg: new ScreenBreakpoint(1200, 1599),
	xl: new ScreenBreakpoint(1600, 999999)
};

export abstract class BreakpointRegistry {
	/**
	 * addCustomBreakpoint method add or replace breakpoint shortcut that could be used inside of SmartQuery
	 * */
	static addCustomBreakpoint(name: string, minWidth: number, maxWidth: number): ScreenBreakpoint {
		let current = registry[name];
		registry[name] = new ScreenBreakpoint(minWidth, maxWidth);
		return current;
	}

	/**
	 * @return known breakpoint shortcut instance
	 * */
	static getBreakpoint(name: string): ScreenBreakpoint {
		return registry[name];
	}
}
