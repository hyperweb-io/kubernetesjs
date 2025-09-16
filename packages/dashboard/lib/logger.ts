/**
 * Logger utility that only logs in development environment by default.
 * Can be forced to log in any environment by passing { force: true } as the last argument.
 *
 * @example
 * // This will only log in development environment
 * logger.log('User logged in:', userId);
 * logger.info('Processing data...');
 * logger.warn('API response took longer than expected.');
 * logger.error('Failed to fetch user data', error);
 *
 * // This will log in *any* environment (development or production)
 * logger.log('Critical configuration loaded', config, { force: true });
 * logger.error('Payment processing failed!', paymentDetails, { force: true });
 */

class Logger {
	// Log in dev only unless forced
	private canLog(options?: { force?: boolean }): boolean {
		return process.env.NODE_ENV === 'development' || options?.force === true;
	}

	log(message?: any, ...optionalParams: any[]): void {
		const lastArg = optionalParams[optionalParams.length - 1];
		const options = typeof lastArg === 'object' && lastArg !== null && 'force' in lastArg ? lastArg : undefined;
		const paramsToLog = options ? optionalParams.slice(0, -1) : optionalParams;

		if (this.canLog(options)) {
			console.log(message, ...paramsToLog);
		}
	}

	info(message?: any, ...optionalParams: any[]): void {
		const lastArg = optionalParams[optionalParams.length - 1];
		const options = typeof lastArg === 'object' && lastArg !== null && 'force' in lastArg ? lastArg : undefined;
		const paramsToLog = options ? optionalParams.slice(0, -1) : optionalParams;

		if (this.canLog(options)) {
			console.info(message, ...paramsToLog);
		}
	}

	warn(message?: any, ...optionalParams: any[]): void {
		const lastArg = optionalParams[optionalParams.length - 1];
		const options = typeof lastArg === 'object' && lastArg !== null && 'force' in lastArg ? lastArg : undefined;
		const paramsToLog = options ? optionalParams.slice(0, -1) : optionalParams;

		if (this.canLog(options)) {
			console.warn(message, ...paramsToLog);
		}
	}

	error(message?: any, ...optionalParams: any[]): void {
		const lastArg = optionalParams[optionalParams.length - 1];
		const options = typeof lastArg === 'object' && lastArg !== null && 'force' in lastArg ? lastArg : undefined;
		const paramsToLog = options ? optionalParams.slice(0, -1) : optionalParams;

		if (this.canLog(options)) {
			console.error(message, ...paramsToLog);
		}
	}
}

// Create and export the singleton instance
export const logger = new Logger();
