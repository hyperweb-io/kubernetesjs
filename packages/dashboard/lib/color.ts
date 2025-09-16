export const isLightColor = (hexColor: string) => {
	const color = hexColor.replace('#', '');

	const red = parseInt(color.substring(0, 2), 16);
	const green = parseInt(color.substring(2, 4), 16);
	const blue = parseInt(color.substring(4, 6), 16);

	const brightness = 0.299 * red + 0.587 * green + 0.114 * blue;

	return brightness >= 128;
};

export const extractColorsFromString = (str: string) => {
	const regex = /#[A-Fa-f0-9]{6}/g;
	const matches = str.match(regex);
	if (matches) {
		return matches.join(', ');
	}
	return '';
};
