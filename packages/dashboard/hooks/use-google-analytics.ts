import { useCallback } from 'react';

import { ANALYTICS } from '@/lib/constants';
import { getCookie } from '@/lib/utils';

interface EventOptions {
	action: string;
	category?: string;
	label?: string;
	value?: number;
	[key: string]: any;
}

export function useGoogleAnalytics() {
	const trackEvent = useCallback((options: EventOptions) => {
		// Check if GA is enabled and consent was given
		const hasConsent = getCookie(ANALYTICS.COOKIE_NAME) === 'true';
		const gaId = ANALYTICS.GA_ID;

		if (!gaId || !hasConsent) {
			return;
		}

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('event', options.action, {
				event_category: options.category,
				event_label: options.label,
				value: options.value,
				...options,
			});
		}
	}, []);

	return { trackEvent };
}
