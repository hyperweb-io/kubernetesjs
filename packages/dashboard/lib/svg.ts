export const downloadSVGZip = async (svgData: { [T: string]: string }, zipName: string) => {
	const JSZip = (await import('jszip')).default;
	const saveAs = (await import('file-saver')).default;

	const zip = new JSZip();

	Object.entries(svgData).forEach(([name, content]) => {
		zip.file(`${name}.svg`, content);
	});

	zip.generateAsync({ type: 'blob' }).then((content) => {
		saveAs(content, zipName);
	});
};

export const downloadSVG = (svgContent: string, svgName: string) => {
	const blob = new Blob([svgContent], { type: 'image/svg+xml' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${svgName}.svg`;
	link.click();

	URL.revokeObjectURL(url);
};

export const transposeArray = <T>(array: T[]): T[] => {
	const numRows = Math.sqrt(array.length);
	const numCols = numRows;

	return Array.from({ length: array.length }, (_, i) => {
		const col = Math.floor(i / numRows);
		const row = i % numRows;
		return array[row * numCols + col];
	});
};

export const extractSVGName = (path: string): string => {
	if (!path.endsWith('.svg')) {
		throw Error(`not a valid svg path: ${path}`);
	}

	const parts = path.split('/');
	const filename = parts[parts.length - 1];
	const name = filename.split('.')[0];

	if (!name) {
		throw Error(`empty svg name for path: ${path}`);
	}

	return name;
};

type ShouldUnoptimizeOptions = {
	optimizeSVG?: boolean;
	optimizeRemote?: boolean;
};

export const shouldUnoptimize = (
	url: string,
	{ optimizeSVG = false, optimizeRemote = false }: ShouldUnoptimizeOptions = {},
): boolean => {
	if (url.startsWith('http') && !optimizeRemote) {
		return true;
	}

	if (url.endsWith('.svg') && !optimizeSVG) {
		return true;
	}

	return false;
};
