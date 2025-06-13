import { JSONSchemaFaker } from 'json-schema-faker';

export interface JSONSchema {
	type?: string;
	properties?: Record<string, JSONSchema>;
	required?: string[];
	items?: JSONSchema | JSONSchema[];
	additionalProperties?: JSONSchema;
	anyOf?: JSONSchema[];
	enum?: (string | number | boolean)[];
	$ref?: string;
	const?: string | number | boolean;
	maxItems?: number;
	minItems?: number;
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	format?: string;
	examples?: any[];
}

// Helper function to detect field types based on property names and assign appropriate formats
export const detectFieldType = (propertyName: string): { format?: string; examples?: string[] } => {
	const lowerName = propertyName.toLowerCase();

	// Email patterns
	if (lowerName.includes('email') || lowerName.includes('mail')) {
		return { format: 'email' };
	}

	// Name patterns
	if (lowerName.includes('name') || lowerName === 'title') {
		return { examples: ['John Doe', 'Alice Smith', 'Bob Johnson', 'Sarah Wilson'] };
	}

	// Address patterns
	if (lowerName.includes('address') || lowerName.includes('street')) {
		return { examples: ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm Dr'] };
	}

	// City patterns
	if (lowerName.includes('city')) {
		return { examples: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] };
	}

	// Country patterns
	if (lowerName.includes('country')) {
		return { examples: ['United States', 'Canada', 'United Kingdom', 'Australia'] };
	}

	// Phone patterns
	if (lowerName.includes('phone') || lowerName.includes('tel')) {
		return { examples: ['+1-555-123-4567', '+1-555-987-6543', '+1-555-456-7890'] };
	}

	// URL patterns
	if (lowerName.includes('url') || lowerName.includes('website') || lowerName.includes('link')) {
		return { format: 'uri' };
	}

	// Date patterns
	if (
		lowerName.includes('date') ||
		lowerName.includes('time') ||
		lowerName.includes('created') ||
		lowerName.includes('updated')
	) {
		return { format: 'date-time' };
	}

	// ID patterns
	if (lowerName.includes('id') || lowerName.includes('uuid')) {
		return { examples: ['abc123def456', 'xyz789uvw012', 'mno345pqr678'] };
	}

	// Company patterns
	if (lowerName.includes('company') || lowerName.includes('organization')) {
		return { examples: ['Acme Corp', 'Tech Solutions Inc', 'Global Industries', 'Future Systems'] };
	}

	// Description patterns
	if (lowerName.includes('description') || lowerName.includes('bio') || lowerName.includes('about')) {
		return { examples: ['A brief description here', 'Some detailed information', 'Relevant details about this item'] };
	}

	return {};
};

// Helper function to enhance schemas with better example values
export const enhanceSchemaForBetterExamples = (schema: JSONSchema, propertyName?: string): JSONSchema => {
	const enhanced = { ...schema };

	// Add reasonable defaults for numbers - prefer integers
	if (enhanced.type === 'number' || enhanced.type === 'integer') {
		// Convert number type to integer for cleaner examples
		enhanced.type = 'integer';
		enhanced.minimum = enhanced.minimum ?? 1;
		enhanced.maximum = enhanced.maximum ?? 100;
	}

	// Add smart defaults for strings based on property name
	if (enhanced.type === 'string' && propertyName) {
		const fieldType = detectFieldType(propertyName);

		if (fieldType.format) {
			enhanced.format = fieldType.format;
		}

		if (fieldType.examples) {
			enhanced.examples = fieldType.examples;
		}

		// Only add generic constraints if no specific format was detected
		if (!fieldType.format && !fieldType.examples) {
			enhanced.minLength = enhanced.minLength ?? 1;
			enhanced.maxLength = enhanced.maxLength ?? 20;
			enhanced.examples = ['example'];
		}
	}

	// Recursively enhance array items
	if (enhanced.type === 'array' && enhanced.items) {
		if (Array.isArray(enhanced.items)) {
			enhanced.items = enhanced.items.map((item) => enhanceSchemaForBetterExamples(item));
		} else {
			enhanced.items = enhanceSchemaForBetterExamples(enhanced.items);
		}
	}

	// Recursively enhance object properties
	if (enhanced.type === 'object' && enhanced.properties) {
		enhanced.properties = Object.fromEntries(
			Object.entries(enhanced.properties).map(([key, value]) => [key, enhanceSchemaForBetterExamples(value, key)]),
		);
	}

	return enhanced;
};

// Configure JSONSchemaFaker for realistic data generation
export const configureFakeDataGenerator = () => {
	// Configure JSONSchemaFaker with more realistic data generation
	JSONSchemaFaker.option({
		alwaysFakeOptionals: true,
		optionalsProbability: 0.8,
		maxLength: 20,
		maxItems: 3,
		useDefaultValue: true,
		fillProperties: false,
		// Enable format support for realistic data
		useExamplesValue: true,
		fixedProbabilities: true,
	});

	// Add custom format generators for more realistic data
	JSONSchemaFaker.extend('faker', () => ({
		internet: {
			email: () => {
				const names = ['john', 'jane', 'alex', 'sarah', 'mike', 'emily'];
				const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];
				const name = names[Math.floor(Math.random() * names.length)];
				const domain = domains[Math.floor(Math.random() * domains.length)];
				return `${name}@${domain}`;
			},
			url: () => {
				const domains = ['example.com', 'test.org', 'demo.net', 'sample.io'];
				const domain = domains[Math.floor(Math.random() * domains.length)];
				return `https://www.${domain}`;
			},
		},
		date: {
			recent: () => new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
		},
	}));
};

// Generate fake data from a JSON schema
export const generateFakeData = (schema: JSONSchema): any => {
	// Handle empty array case for functions with no parameters
	if (schema.type === 'array' && schema.maxItems === 0) {
		return [];
	}

	// Configure the generator
	configureFakeDataGenerator();

	// Generate fake data based on enhanced schema
	const enhancedSchema = enhanceSchemaForBetterExamples(schema);
	const fakeData = JSONSchemaFaker.generate(enhancedSchema as any);

	// Check if the generated data contains unknown types (empty objects)
	// and return empty array instead
	if (
		Array.isArray(fakeData) &&
		fakeData.length > 0 &&
		fakeData.every((item) => typeof item === 'object' && item !== null && Object.keys(item).length === 0)
	) {
		return [];
	}

	return fakeData;
};
