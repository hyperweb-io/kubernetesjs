import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

import { PostMetadata } from '@/types/blog.types';

import { getAuthorAvatarUrl, getAuthorName } from './lookup';

const getFullPath = (filePath: string) => path.join(process.cwd(), filePath);

export const extractMarkdownData = <M>(mdFilePath: string, isFullPath: boolean = false) => {
	let fileContent = '';
	const fullPath = isFullPath ? mdFilePath : getFullPath(mdFilePath);

	try {
		fileContent = fs.readFileSync(fullPath, 'utf8');
	} catch (error) {
		console.error(error);
		throw new Error(`file not found: ${fullPath}`);
	}

	const { data: metadata, content } = matter(fileContent);

	return { metadata, content } as { metadata: M; content: string };
};

export const isFileExists = (filePath: string, isFullPath: boolean = false) => {
	const fullPath = isFullPath ? filePath : getFullPath(filePath);

	return fs.existsSync(fullPath);
};

export interface CodeBlock {
	id: string;
	lang: string;
	value: string;
}

export const extractCodeFromMd = (mdFilePath: string) => {
	const { content } = extractMarkdownData(mdFilePath);
	const ast = remark().parse(content);

	const codeBlocks: CodeBlock[] = [];

	visit(ast, 'code', (node) => {
		const { value, lang, meta } = node;

		if (!lang || !meta) {
			throw new Error('code language or meta is not set');
		}

		codeBlocks.push({ id: meta, lang, value });
	});

	return codeBlocks;
};

export const getFileNames = (dir: string, isFullPath: boolean = false) => {
	const dirPath = isFullPath ? dir : getFullPath(dir);

	try {
		return fs.readdirSync(dirPath);
	} catch (error) {
		console.error(error);
		throw new Error(`failed to read directory: ${dirPath}`);
	}
};

export const getPostsMetadata = (postsDir: string): PostMetadata[] => {
	const postsDirPath = getFullPath(postsDir);

	const postsMetadata = getFileNames(postsDirPath, true).map((postFileName) => {
		const postFilePath = path.join(postsDirPath, postFileName);
		const metadata = extractMarkdownData<Omit<PostMetadata, 'id'>>(postFilePath, true).metadata;

		return {
			...metadata,
			id: postFileName.replace('.md', ''),
		};
	});

	return postsMetadata;
};

export type PostInfo = PostMetadata & { avatarSrc: string; authorName: string };

export const getPostsInfo = (postsDir: string): PostInfo[] => {
	return getPostsMetadata(postsDir).map((meta) => {
		const avatarSrc = getAuthorAvatarUrl(meta.authorGithubId) ?? '';
		const authorName = getAuthorName(meta.authorGithubId);
		return { ...meta, avatarSrc, authorName };
	});
};
