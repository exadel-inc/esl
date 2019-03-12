class ScreenBreakpoint {

	public min: number;
	public max: number;

	constructor(min: number, max: number) {
		this.min = min;
		this.max = max;
	}

	get mediaQuery() {
		return `(min-width: ${this.min}px) and (max-width: ${this.max}px)`;
	}

	get mediaQueryGE() {
		return `(min-width: ${this.min}px)`;
	}

	get mediaQueryLE() {
		return `(max-width: ${this.max}px)`;
	}
}

export const BREAKPOINTS: any = {
	xs: new ScreenBreakpoint(1, 767),
	sm: new ScreenBreakpoint(768, 991),
	md: new ScreenBreakpoint(992, 1199),
	lg: new ScreenBreakpoint(1200, 1599),
	xl: new ScreenBreakpoint(1600, 999999)
};