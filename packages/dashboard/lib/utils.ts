import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isExternalImage(url: string) {
	return url.startsWith('https://');
}

export function truncateString(str: string, maxLength = 10) {
	return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

export function getCookie(name: string) {
	if (typeof document === 'undefined') return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift();
	return null;
}

/**
 * Checks if the current environment is macOS based on the user agent string.
 * Handles potential errors and server-side rendering.
 * @returns {boolean} True if macOS is detected, false otherwise.
 */
export function isMacOS(): boolean {
	// Check if running in a browser environment first
	if (typeof navigator === 'undefined') {
		return false;
	}

	try {
		// Use userAgent check as navigator.platform is deprecated
		return navigator.userAgent.indexOf('Mac') !== -1;
	} catch (e) {
		console.error('Error detecting platform from userAgent:', e);
		return false; // Assume not Mac on error
	}
}

/**
 * Safely parses a JSON string and returns both the parsed data and any error.
 * This allows the caller to decide how to handle parse errors.
 * @param json - The JSON string to parse
 * @returns Object containing data (parsed result or null) and error (Error or null)
 */
export function safeJSONParse(json: string): { data: any; error: Error | null } {
	try {
		return { data: JSON.parse(json), error: null };
	} catch (e) {
		return {
			data: null,
			error: e instanceof Error ? e : new Error(String(e)),
		};
	}
}
