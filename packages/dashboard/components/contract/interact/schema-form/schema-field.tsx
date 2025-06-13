import { JSONSchema } from '@hyperweb/parse';

import { getNonNullSchema, isNullableSchema } from '@/lib/contract/interact';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ArrayField } from './fields/array-field';
import { ObjectField } from './fields/object-field';

const NULLABLE_PLACEHOLDER = 'Leave empty for null';

interface SchemaFieldProps {
	schema: JSONSchema;
	value: any;
	onChange: (value: any) => void;
	disabled?: boolean;
	depth?: number;
	path?: string;
	showLabel?: boolean;
	label?: string;
}

export const SchemaField = ({
	schema,
	value,
	onChange,
	disabled,
	depth = 0,
	path = '',
	showLabel = false,
	label,
}: SchemaFieldProps) => {
	const nullable = isNullableSchema(schema);
	const nonNullSchema = nullable ? getNonNullSchema(schema) : schema;
	const isStringType = nonNullSchema.type === 'string';

	// For nullable strings, track empty string vs actual content
	// For other nullable types, empty means null automatically
	const isEmptyString = isStringType && nullable && value === '';

	const handleEmptyStringToggle = (checked: boolean) => {
		if (checked) {
			onChange('');
		} else {
			onChange(null);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (nonNullSchema.type === 'number' || nonNullSchema.type === 'integer') {
			// For nullable numbers, empty string means null
			if (inputValue === '') {
				onChange(nullable ? null : '');
			} else {
				const numValue = nonNullSchema.type === 'integer' ? parseInt(inputValue, 10) : parseFloat(inputValue);
				onChange(isNaN(numValue) ? inputValue : numValue);
			}
		} else {
			// For strings, handle normally
			onChange(inputValue);
		}
	};

	const renderEmptyStringToggle = () => {
		if (!nullable || !isStringType) return null;

		return (
			<div className='mt-2 flex items-center space-x-2'>
				<Checkbox
					id={`empty-string-toggle-${path}`}
					checked={isEmptyString}
					onCheckedChange={handleEmptyStringToggle}
					disabled={disabled}
				/>
				<Label
					htmlFor={`empty-string-toggle-${path}`}
					className='cursor-pointer text-sm font-normal text-muted-foreground'
				>
					Set to empty string
				</Label>
			</div>
		);
	};

	// Helper function to get type display for all fields
	const getTypeDisplay = () => {
		if (!showLabel) return null;

		let baseType = nonNullSchema.type;
		if (nonNullSchema.enum) {
			baseType = 'enum';
		}

		if (!baseType) return null;

		return nullable ? `(${baseType} | null)` : `(${baseType})`;
	};

	const renderField = () => {
		// Handle boolean type
		if (nonNullSchema.type === 'boolean') {
			const fieldId = `boolean-field-${path || Math.random().toString(36).slice(2, 11)}`;

			return (
				<div className='flex items-center space-x-2'>
					<Checkbox
						id={fieldId}
						checked={Boolean(value)}
						onCheckedChange={(checked) => onChange(checked)}
						disabled={disabled}
					/>
					<Label htmlFor={fieldId} className='font-mono text-sm tracking-tighter'>
						{value ? 'true' : 'false'}
					</Label>
				</div>
			);
		}

		// Handle enum type
		if (nonNullSchema.enum && Array.isArray(nonNullSchema.enum)) {
			const enumValues = nonNullSchema.enum;
			const stringValue = String(value || '');

			const getPlaceholder = () => {
				if (nullable && !isStringType) return NULLABLE_PLACEHOLDER;
				return 'Select an option...';
			};

			// Use radio group for 4 or fewer options, dropdown for more
			if (enumValues.length <= 4) {
				return (
					<RadioGroup
						value={stringValue}
						onValueChange={(val) => {
							// Try to preserve the original type
							const originalValue = enumValues.find((enumVal) => String(enumVal) === val);
							onChange(originalValue !== undefined ? originalValue : val);
						}}
						disabled={disabled}
					>
						{enumValues.map((enumValue, index) => {
							const optionId = `enum-${path || Math.random().toString(36).slice(2, 11)}-${index}`;
							return (
								<div key={index} className='flex items-center space-x-2'>
									<RadioGroupItem value={String(enumValue)} id={optionId} />
									<Label htmlFor={optionId} className='text-sm'>
										{String(enumValue)}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				);
			} else {
				return (
					<Select
						value={stringValue}
						onValueChange={(val) => {
							const selectedValue = enumValues.find((enumVal) => String(enumVal) === val);
							onChange(selectedValue !== undefined ? selectedValue : val);
						}}
						disabled={disabled}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder={getPlaceholder()} />
						</SelectTrigger>
						<SelectContent className='max-h-[240px] overflow-y-auto'>
							{enumValues.map((enumValue, index) => (
								<SelectItem key={index} value={String(enumValue)}>
									{String(enumValue)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}
		}

		// Handle object type
		if (nonNullSchema.type === 'object') {
			return (
				<ObjectField
					schema={nonNullSchema}
					value={value || {}}
					onChange={onChange}
					disabled={disabled}
					depth={depth}
					path={path}
				/>
			);
		}

		// Handle array type
		if (nonNullSchema.type === 'array') {
			return (
				<ArrayField
					schema={nonNullSchema}
					value={value || []}
					onChange={onChange}
					disabled={disabled}
					depth={depth}
					path={path}
				/>
			);
		}

		// Convert value to string for input display
		const displayValue = value === undefined || value === null || value === '' ? '' : String(value);

		const getPlaceholder = (fieldType: string) => {
			if (fieldType === 'string') {
				if (nullable) {
					return isEmptyString ? 'Empty string' : NULLABLE_PLACEHOLDER;
				}
				return 'Enter text...';
			}
			if (nullable) {
				return NULLABLE_PLACEHOLDER;
			}
			return 'Enter number...';
		};

		if (nonNullSchema.type === 'string') {
			return (
				<Input
					type='text'
					value={displayValue}
					onChange={handleChange}
					disabled={disabled}
					placeholder={getPlaceholder('string')}
				/>
			);
		}

		if (nonNullSchema.type === 'number' || nonNullSchema.type === 'integer') {
			return (
				<Input
					type='number'
					value={displayValue}
					onChange={handleChange}
					disabled={disabled}
					placeholder={getPlaceholder('number')}
					step={nonNullSchema.type === 'integer' ? '1' : 'any'}
				/>
			);
		}

		// Fallback for unsupported types
		return (
			<div className='flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4'>
				<p className='text-sm text-muted-foreground'>Unsupported field type: {nonNullSchema.type || 'unknown'}</p>
			</div>
		);
	};

	return (
		<div className='space-y-2'>
			{showLabel && label && (
				<Label className='text-sm'>
					{label}
					{getTypeDisplay() && (
						<span className='ml-1 text-[13px] font-normal text-muted-foreground'>{getTypeDisplay()}</span>
					)}
				</Label>
			)}
			{renderField()}
			{renderEmptyStringToggle()}
		</div>
	);
};
