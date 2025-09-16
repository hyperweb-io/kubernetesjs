import { FileUp, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { bytesToKb } from '@/lib/contract/deploy';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SIZE_CONFIG = {
	sm: 64_000, // 64KB
	md: 128_000, // 128KB
	lg: 512_000, // 512KB
} as const;

export type FileSize = keyof typeof SIZE_CONFIG;

const FILE_TYPE_CONFIG = {
	js: {
		accept: { 'application/javascript': ['.js'] } as Record<string, string[]>,
	},
	json: {
		accept: { 'application/json': ['.json'] } as Record<string, string[]>,
	},
	ts: {
		accept: { 'text/typescript': ['.ts'] } as Record<string, string[]>,
	},
};

export type FileType = keyof typeof FILE_TYPE_CONFIG;

type FileUploaderProps = {
	file?: File | null;
	onFileChange?: (file: File | null) => void;
	className?: string;
	fileTypes?: FileType[];
	maxFileSize?: FileSize;
	description?: string;
};

export const FileUploader = ({
	file,
	onFileChange,
	className,
	fileTypes = ['js'],
	maxFileSize = 'md',
	description,
}: FileUploaderProps) => {
	// Merge accept configurations for multiple file types
	const accept = fileTypes.reduce(
		(acc, type) => {
			const typeConfig = FILE_TYPE_CONFIG[type];
			return { ...acc, ...typeConfig.accept };
		},
		{} as Record<string, string[]>,
	);

	const maxSize = SIZE_CONFIG[maxFileSize];

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (files) => onFileChange?.(files[0]),
		multiple: false,
		accept,
		maxSize,
	});

	const fileExtensions = fileTypes.map((type) => `.${type}`).join(', ');

	const fileInfo = file
		? {
				title: file.name,
				description: `File size: ${bytesToKb(file.size)}KB`,
			}
		: {
				title: `Drag & drop ${fileExtensions} file here or click to upload`,
				description: description || `Max file size: ${bytesToKb(maxSize)}KB`,
			};

	return (
		<div
			className={cn(
				`relative flex h-[206px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed
				border-foreground/20 p-4`,
				file ? 'cursor-default' : 'cursor-pointer',
				className,
			)}
			{...(file ? {} : getRootProps())}
		>
			{!file && <input {...getInputProps()} />}
			<FileUp className='size-14' strokeWidth={1.4} />
			<div className='flex flex-col items-center gap-1 text-center'>
				<p className='text-md font-medium'>{fileInfo.title}</p>
				<p className='text-sm text-muted-foreground'>{fileInfo.description}</p>
			</div>
			{file && (
				<Button
					className='absolute bottom-1 right-0'
					variant='text'
					size='sm'
					type='button'
					onClick={(e) => {
						e.stopPropagation();
						onFileChange?.(null);
					}}
				>
					<Trash2 /> Remove
				</Button>
			)}
		</div>
	);
};
