import { useMediaQuery } from './use-media-query';

const breakpoints = {
	xs: '480px',
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
} as const;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
	const breakpointValue = breakpoints[breakpointKey];
	const bool = useMediaQuery(`(max-width: ${breakpointValue})`);
	const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

	type KeyAbove = `isAbove${Capitalize<K>}`;
	type KeyBelow = `isBelow${Capitalize<K>}`;

	return {
		[breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, '')),
		[`isAbove${capitalizedKey}`]: !bool,
		[`isBelow${capitalizedKey}`]: bool,
	} as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>;
}
