export type ThemeColorKey =
	| 'main'
	| 'secondary'
	| 'accent'
	| 'danger'
	| 'warning'
	| 'success'
	| 'info'
	| 'text'
	| 'bg';

export type LcarsTheme = Partial<Record<ThemeColorKey, string>>;

/**
 * aria-current allowed values:
 * https://www.w3.org/TR/wai-aria-1.2/#aria-current
 */
export type AriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | false;

export const themeVar = Object.assign((key: ThemeColorKey) => `var(--theme-${key})`, {
	// for quick existence checks / mapping
	map: {
		main: true,
		secondary: true,
		accent: true,
		danger: true,
		warning: true,
		success: true,
		info: true,
		text: true,
		bg: true
	} as const
});

/**
 * Apply theme tokens as CSS variables:
 * --theme-main, --theme-secondary, etc.
 */
export function applyTheme(theme: LcarsTheme, target: HTMLElement = document.documentElement) {
	for (const [key, value] of Object.entries(theme)) {
		if (!value) continue;
		target.style.setProperty(`--theme-${key}`, value);
	}
}

/**
 * Convenience: resolve a color input into a usable CSS value.
 * - "main" -> var(--theme-main)
 * - "#f90" -> "#f90"
 * - "var(--theme-main)" -> "var(--theme-main)"
 */
export function resolveColor(color: ThemeColorKey | string): string {
	if (typeof color !== 'string') return themeVar(color);
	if (color in themeVar.map) return themeVar(color as ThemeColorKey);
	return color;
}
