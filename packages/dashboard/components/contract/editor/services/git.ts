import { logger } from '@/lib/logger';

import { getFileSystem } from './fs';

// Keep constants that don't depend on runtime env vars
export const GIT_CONFIG = {
	rootDir: '/hyperweb',
	branch: 'main',
	depth: 1,
	repoUrl: 'https://github.com/hyperweb-io/create-hyperweb-app',
	projectPath: '/templates/hyperweb',
	exclude: ['__tests__', 'jest.config.js', 'CHANGELOG.md', 'dist', 'test-utils', 'ui'],
	defaultTarballName: process.env.NEXT_PUBLIC_S3_TARBALL_NAME || 'latest.tar.gz',
};

/**
 * Constructs the tarball URL based on the commit hash or uses the 'latest' version
 * @param {string} s3BaseUrl - The base URL of the S3 bucket provided at runtime.
 */
export async function getTarballUrl(s3BaseUrl: string): Promise<string> {
	// Validate S3 Base URL
	if (!s3BaseUrl) {
		logger.error('S3 Base URL is missing. Cannot construct tarball URL.');
		// Return a placeholder or throw an error, depending on desired handling
		return ''; // Or throw new Error('S3 Base URL is required');
	}

	// First, try to use the 'latest.tar.gz' file
	const latestTarballUrl = `${s3BaseUrl}/${GIT_CONFIG.defaultTarballName}`;

	// Check if the latest tarball exists and is accessible
	try {
		logger.info(`Checking if latest tarball exists at ${latestTarballUrl}`);
		const response = await fetch(latestTarballUrl, { method: 'HEAD' });

		if (response.ok) {
			return latestTarballUrl;
		} else {
			logger.warn(`Latest tarball not accessible: ${response.status} ${response.statusText}, falling back to default.`);
		}
	} catch (error) {
		logger.warn('Error checking latest tarball, falling back to default:', error);
	}

	return latestTarballUrl;
}

/**
 * Checks if the browser supports the DecompressionStream API
 */
function isDecompressionStreamSupported(): boolean {
	return typeof DecompressionStream !== 'undefined';
}

/**
 * Creates a minimal fallback template with basic files
 */
export async function createMinimalTemplate(dir: string): Promise<boolean> {
	try {
		const fs = getFileSystem();

		// Create src directory
		const srcDir = `${dir}/src`;
		await fs.promises.mkdir(srcDir, { recursive: true });

		// Create a simple contract.ts file
		const contractContent = `
        export interface CounterContract {
          getCount: () => Promise<number>;
          increment: () => Promise<void>;
          reset: (count: number) => Promise<void>;
        }
    `;

		await fs.promises.writeFile(`${srcDir}/contract.ts`, contractContent, 'utf8');

		// Create a README.md file
		const readmeContent = `# HyperWeb Contract

    This is a minimal contract template.

    ## Getting Started

    1. Edit the contract.ts file to implement your contract logic
    2. Use the HyperWeb tools to test and deploy your contract
  `;

		await fs.promises.writeFile(`${dir}/README.md`, readmeContent, 'utf8');

		return true;
	} catch (error) {
		logger.error('Error creating minimal template:', error);
		return false;
	}
}

/**
 * Interface for downloadAndExtractRepo options
 */
interface DownloadOptions {
	dir: string;
	s3BaseUrl: string; // Make S3 base URL required
	verbose?: boolean;
}

/**
 * Downloads a repository tarball from S3 and extracts it to the specified directory
 */
export async function downloadAndExtractRepo({ dir, s3BaseUrl }: DownloadOptions): Promise<boolean> {
	try {
		// Validate S3 Base URL early
		if (!s3BaseUrl) {
			logger.error('S3 Base URL is required for downloadAndExtractRepo.');
			return false; // Cannot proceed without the URL
		}

		// Get the filesystem instance
		const fs = getFileSystem();

		// Create target directory
		await fs.promises.mkdir(dir, { recursive: true });

		// Get the dynamic tarball URL using the provided s3BaseUrl
		const tarballUrl = await getTarballUrl(s3BaseUrl);

		// Handle case where getTarballUrl couldn't construct a URL (e.g., missing s3BaseUrl)
		if (!tarballUrl) {
			logger.error('Failed to determine tarball URL. Cannot download.');
			return await createMinimalTemplate(dir); // Fallback to minimal template
		}

		try {
			// Download the tarball from S3
			logger.info(`Initiating fetch request to: ${tarballUrl}`);
			const response = await fetch(tarballUrl);

			if (!response.ok) {
				logger.error(`Failed to download repository: ${response.status} ${response.statusText}`);
				logger.error('Headers:', Object.fromEntries([...response.headers.entries()]));
				return await createMinimalTemplate(dir);
			}

			// Get the tarball as an ArrayBuffer
			const tarballData = await response.arrayBuffer();
			logger.info(`Downloaded tarball: ${tarballData.byteLength} bytes`);

			if (tarballData.byteLength === 0) {
				logger.error('Downloaded tarball is empty');
				return await createMinimalTemplate(dir);
			}

			// Since we're dealing with a tar.gz file, we need to:
			// 1. Decompress the gzip data
			// 2. Extract the tar archive
			// 3. Copy the files to our filesystem

			if (!isDecompressionStreamSupported()) {
				logger.error('DecompressionStream API is not supported in this browser');
				logger.error('Please use a modern browser like Chrome, Edge, or Firefox');
				return await createMinimalTemplate(dir);
			}

			try {
				// Create a ReadableStream from the ArrayBuffer
				const dataStream = new ReadableStream({
					start(controller) {
						controller.enqueue(new Uint8Array(tarballData));
						controller.close();
					},
				});

				// Decompress the gzip data using the browser's built-in DecompressionStream
				const decompressionStream = dataStream.pipeThrough(new DecompressionStream('gzip'));

				// Get the decompressed data as an ArrayBuffer
				const decompressedData = await new Response(decompressionStream).arrayBuffer();

				// Now we need to extract the tar archive
				const extractedFiles = await extractTarArchive(new Uint8Array(decompressedData), dir);

				if (extractedFiles === 0) {
					logger.error('No files were extracted from the tar archive');
					return await createMinimalTemplate(dir);
				}

				logger.info(`Repository downloaded and extracted to ${dir}`);
				return true;
			} catch (processingError) {
				logger.error('Error processing tar.gz file:', processingError);
				return await createMinimalTemplate(dir);
			}
		} catch (fetchError) {
			logger.error('Error downloading tarball:', fetchError);
			if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
				logger.error('This might be a CORS issue. Check the S3 bucket CORS configuration.');
			}
			return await createMinimalTemplate(dir);
		}
	} catch (error) {
		logger.error('Error in downloadAndExtractRepo:', error);
		return false;
	}
}

/**
 * Extracts a tar archive to the specified directory
 * This is a simplified implementation that handles the basic tar format
 */
async function extractTarArchive(tarData: Uint8Array, destDir: string): Promise<number> {
	const fs = getFileSystem();
	let position = 0;
	let extractedFiles = 0;

	// Process each file in the tar archive
	while (position + 512 <= tarData.length) {
		// Read the header block (512 bytes)
		const headerBlock = tarData.slice(position, position + 512);
		position += 512;

		// Check if we've reached the end of the archive (indicated by two consecutive zero-filled blocks)
		if (isZeroFilled(headerBlock)) {
			// Skip the second zero-filled block if it exists
			if (position + 512 <= tarData.length && isZeroFilled(tarData.slice(position, position + 512))) {
				position += 512;
			}
			break;
		}

		// Parse the header
		const fileName = parseString(headerBlock, 0, 100).replace(/\0/g, '');
		const fileSize = parseInt(parseString(headerBlock, 124, 12), 8);
		const fileType = headerBlock[156]; // 0 or '0' for regular file, '5' for directory

		// logger.info(`Found file in tar: ${fileName}, size: ${fileSize}, type: ${fileType}`);

		// Skip empty file names
		if (!fileName) {
			// Skip the file data blocks
			position += Math.ceil(fileSize / 512) * 512;
			continue;
		}

		// Handle directories (type '5')
		if (fileType === 53) {
			// ASCII '5'
			const dirPath = `${destDir}/${fileName}`;
			// logger.info(`Creating directory: ${dirPath}`);
			await fs.promises.mkdir(dirPath, { recursive: true });
		}
		// Handle regular files (type '0' or 0)
		else if (fileType === 0 || fileType === 48) {
			// ASCII '0'
			// Read the file data
			const fileData = tarData.slice(position, position + fileSize);

			// Create the file path
			const filePath = `${destDir}/${fileName}`;

			// Create parent directories if needed
			const lastSlashIndex = filePath.lastIndexOf('/');
			if (lastSlashIndex > 0) {
				const dirPath = filePath.substring(0, lastSlashIndex);
				await fs.promises.mkdir(dirPath, { recursive: true });
			}

			// Write the file
			// logger.info(`Writing file: ${filePath} (${fileData.length} bytes)`);
			await fs.promises.writeFile(filePath, fileData);
			extractedFiles++;
		}

		// Move to the next file (padding to 512-byte boundary)
		position += Math.ceil(fileSize / 512) * 512;
	}

	return extractedFiles;
}

/**
 * Checks if a buffer is filled with zeros
 */
function isZeroFilled(buffer: Uint8Array): boolean {
	for (let i = 0; i < buffer.length; i++) {
		if (buffer[i] !== 0) {
			return false;
		}
	}
	return true;
}

/**
 * Parses a string from a buffer at the specified offset and length
 */
function parseString(buffer: Uint8Array, offset: number, length: number): string {
	const bytes = buffer.slice(offset, offset + length);
	return new TextDecoder().decode(bytes);
}
