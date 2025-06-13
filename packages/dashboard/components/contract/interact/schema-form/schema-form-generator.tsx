import { useMemo } from 'react';
import { JSONSchema, SchemaMethodInfo } from '@hyperweb/parse';

import { getNonNullSchema, isNullableSchema } from '@/lib/contract/interact';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';

import { SchemaField } from './schema-field';

interface SchemaFormGeneratorProps {
	schema?: JSONSchema;
	selectedMethod?: SchemaMethodInfo;
	value: any[];
	onChange: (value: any[]) => void;
	disabled?: boolean;
}

// Helper function to check if a schema type is supported (including nullable versions)
const isSupportedType = (item: JSONSchema): boolean => {
	// Handle nullable schemas by extracting the base type
	const baseSchema = isNullableSchema(item) ? getNonNullSchema(item) : item;

	// Check if the base type is supported
	return !!(
		baseSchema.type === 'string' ||
		baseSchema.type === 'number' ||
		baseSchema.type === 'integer' ||
		baseSchema.type === 'boolean' ||
		baseSchema.type === 'object' ||
		baseSchema.type === 'array' ||
		(baseSchema.enum && Array.isArray(baseSchema.enum))
	);
};

export const SchemaFormGenerator = ({
	schema,
	selectedMethod,
	value,
	onChange,
	disabled,
}: SchemaFormGeneratorProps) => {
	const isSupported = useMemo((): boolean => {
		if (!schema || schema.type !== 'array' || !schema.items) {
			return false;
		}

		// Check if all items in the tuple array are supported types
		if (Array.isArray(schema.items)) {
			if (schema.items.length === 0) return true;
			return schema.items.every((item: JSONSchema) => isSupportedType(item));
		}

		return false;
	}, [schema]);

	if (!schema) {
		return (
			<div className='flex w-full flex-1 items-center justify-center p-8 text-center'>
				<p className='text-muted-foreground'>No schema available</p>
			</div>
		);
	}

	// Handle no parameters case
	if ((schema as any).maxItems === 0) {
		return (
			<div className='flex w-full flex-1 items-center justify-center p-8 text-center'>
				<p className='text-muted-foreground'>This function takes no parameters</p>
			</div>
		);
	}

	if (!isSupported) {
		return (
			<div className='flex w-full flex-1 items-center justify-center p-8 text-center'>
				<p className='text-muted-foreground'>Schema not supported</p>
			</div>
		);
	}

	const items = Array.isArray(schema.items) ? schema.items : [];

	const handleFieldChange = (index: number, fieldValue: unknown) => {
		const newValue = [...value];
		newValue[index] = fieldValue;
		onChange(newValue);
	};

	return (
		<div className='space-y-4'>
			{items.map((item, index) => {
				const paramName = selectedMethod?.params?.[index]?.name || `Parameter ${index + 1}`;

				return (
					<FormItem key={index}>
						<FormControl>
							<SchemaField
								schema={item}
								value={value[index]}
								onChange={(fieldValue: unknown) => handleFieldChange(index, fieldValue)}
								disabled={disabled}
								showLabel={true}
								label={paramName}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				);
			})}
		</div>
	);
};
