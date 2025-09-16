export const creditFromFaucet = async (address: string, denom: string, faucetUrl: string) => {
	const response = await fetch(faucetUrl, {
		method: 'POST',
		body: JSON.stringify({
			address,
			denom,
		}),
		headers: {
			'Content-type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(response.statusText || 'Unknown error');
	}

	return await response.json();
};
