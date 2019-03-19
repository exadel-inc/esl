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

const BP_NAME_REGEXP = /^[a-z]{1,}/i;

export abstract class BreakpointRegistry {
	/**
	 * addCustomBreakpoint method add or replace breakpoint shortcut that could be used inside of SmartQuery
	 * */
	public static addCustomBreakpoint(name: string, minWidth: number, maxWidth: number): ScreenBreakpoint {
		name = name.toLowerCase();
		if (BP_NAME_REGEXP.test(name)) {
			let current = registry[name];
			registry[name] = new ScreenBreakpoint(minWidth, maxWidth);
			return current;
		}
		throw new Error('Shortcut should consist only from Latin characters. Length should be at least one character.');
	}

	/**
	 * @return known breakpoint shortcut instance
	 * */
	public static getBreakpoint(name: string): ScreenBreakpoint {
		return registry[(name || '').toLowerCase()];
	}

	public static getAllBreakpointsNames() {
		return Object.keys(registry);
	}

	// todo doc
	public static apply(query: string) {
		const breakpoints = Object.keys(registry);
		const breakpointRegex = new RegExp(`@([+-]{0,1})(${breakpoints.join('|')})`,'ig');

		return query.replace(breakpointRegex, (match, sign, bp) => {
			const shortcut = BreakpointRegistry.getBreakpoint(bp);
			switch (sign) {
				case '+':
					return shortcut.mediaQueryGE;
				case '-':
					return shortcut.mediaQueryLE;
				default:
					return shortcut.mediaQuery;
			}
		});
	}
}
