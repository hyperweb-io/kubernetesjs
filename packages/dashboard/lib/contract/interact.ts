import { JSONSchema } from '@hyperweb/parse';
import { fromBech32 } from '@interchainjs/encoding';

export const isValidJson = (
	value: string,
	{ allowEmpty = false }: { allowEmpty?: boolean } = {},
): { isValid: boolean; error?: string } => {
	const trimmedValue = value.trim();

	if (allowEmpty && !trimmedValue) {
		return { isValid: true };
	}

	if (!trimmedValue) {
		return { isValid: false, error: 'Input is empty' };
	}

	try {
		JSON.parse(trimmedValue);
		return { isValid: true };
	} catch (error) {
		return {
			isValid: false,
			error: error instanceof Error ? error.message : 'Invalid JSON',
		};
	}
};

export const validateContractAddress = (address: string, bech32Prefix: string, length: number) => {
	if (!bech32Prefix) return 'Cannot retrieve bech32 prefix of the current network.';

	if (!address.startsWith(bech32Prefix)) return `Invalid prefix (expected "${bech32Prefix}")`;

	if (address.length !== length) return 'Invalid address length';

	try {
		fromBech32(address);
	} catch (e) {
		return (e as Error).message;
	}

	return null;
};

// Helper function to check if a schema supports null values
export const isNullableSchema = (schema: JSONSchema): boolean => {
	// Check for explicit nullable property
	if ((schema as any).nullable === true) return true;

	// Check for null in anyOf
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		return schema.anyOf.some((subSchema: any) => subSchema.type === 'null');
	}

	// Check for null in enum
	if (schema.enum && Array.isArray(schema.enum)) {
		return (schema.enum as any[]).includes(null);
	}

	return false;
};

// Helper function to get the non-null schema from a nullable schema
export const getNonNullSchema = (schema: JSONSchema): JSONSchema => {
	// If there's anyOf with null, return the non-null schema
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const nonNullSchema = schema.anyOf.find((subSchema: any) => subSchema.type !== 'null');
		if (nonNullSchema) return nonNullSchema;
	}

	// If there's enum with null, create a new schema without null
	if (schema.enum && Array.isArray(schema.enum)) {
		const nonNullEnum = schema.enum.filter((val: any) => val !== null);
		if (nonNullEnum.length > 0) {
			return { ...schema, enum: nonNullEnum };
		}
	}

	// Return the original schema (removing nullable flag if present)
	const { nullable, ...cleanSchema } = schema as any;
	return cleanSchema;
};

export const formatDetailedType = (schema: any): string => {
	if (!schema) return 'unknown';

	// Use the common isNullable function
	const isNullable = isNullableSchema(schema);

	// Get the base type without null
	let baseType = '';

	switch (schema.type) {
		case 'object':
			if (schema.properties) {
				const props = Object.entries(schema.properties)
					.map(([key, propSchema]: [string, any]) => {
						const isRequired = schema.required?.includes(key);
						const propType = formatDetailedType(propSchema);
						return `${key}${isRequired ? '' : '?'}: ${propType}`;
					})
					.join(', ');
				baseType = `{ ${props} }`;
			} else {
				baseType = 'object';
			}
			break;

		case 'array':
			if (schema.items) {
				if (Array.isArray(schema.items)) {
					// Tuple array
					const itemTypes = schema.items.map((item: any) => formatDetailedType(item)).join(', ');
					baseType = `[${itemTypes}]`;
				} else {
					// Regular array
					const itemType = formatDetailedType(schema.items);
					baseType = `${itemType}[]`;
				}
			} else {
				baseType = 'array';
			}
			break;

		case 'string':
			if (schema.enum) {
				const nonNullEnum = (schema.enum as any[]).filter((v) => v !== null);
				baseType = nonNullEnum.map((v: any) => `"${v}"`).join(' | ');
			} else {
				baseType = 'string';
			}
			break;

		case 'number':
		case 'integer':
			if (schema.enum) {
				const nonNullEnum = (schema.enum as any[]).filter((v) => v !== null);
				baseType = nonNullEnum.join(' | ');
			} else {
				baseType = schema.type;
			}
			break;

		case 'boolean':
			baseType = 'boolean';
			break;

		default:
			if (schema.anyOf) {
				const nonNullSchemas = schema.anyOf.filter((s: any) => s.type !== 'null');
				baseType = nonNullSchemas.map((s: any) => formatDetailedType(s)).join(' | ');
			} else {
				baseType = schema.type || 'unknown';
			}
			break;
	}

	// Return the type, adding "| null" if it's nullable
	return isNullable ? `${baseType} | null` : baseType;
};

export const formatFunctionSignature = (method: any) => {
	if (!method || !method.params) return '';

	const params = method.params
		.map((param: any) => {
			const typeName = formatDetailedType(param.schema);
			return `${param.name || 'arg'}: ${typeName}`;
		})
		.join(', ');

	return `${method.name}(${params})`;
};
