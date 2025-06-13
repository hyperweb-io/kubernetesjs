import { useState } from 'react';
import { JSONSchema } from '@hyperweb/parse';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SchemaField } from '../schema-field';

interface ArrayFieldProps {
	schema: JSONSchema;
	value: any[];
	onChange: (value: any[]) => void;
	disabled?: boolean;
	depth?: number;
	path?: string;
}

const MAX_DEPTH = 5; // Prevent infinite recursion

export const ArrayField = ({ schema, value = [], onChange, disabled, depth = 0, path = '' }: ArrayFieldProps) => {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	// Smart auto-expand logic: expand if ≤3 items or if it's a shallow array
	const [isExpanded, setIsExpanded] = useState(() => {
		const itemCount = value.length;
		return itemCount <= 3 || depth < 2;
	});

	// Prevent infinite recursion
	if (depth >= MAX_DEPTH) {
		return (
			<div className='flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4'>
				<p className='text-sm text-muted-foreground'>Max nesting depth reached</p>
			</div>
		);
	}

	if (!schema.items) {
		return (
			<div className='flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4'>
				<p className='text-sm text-muted-foreground'>Array schema has no items definition</p>
			</div>
		);
	}

	// Determine if this is a tuple array (fixed length) or list array (variable length)
	const isTupleArray = Array.isArray(schema.items);
	const itemSchema = isTupleArray ? null : (schema.items as JSONSchema);
	const tupleSchemas = isTupleArray ? (schema.items as JSONSchema[]) : null;

	// Get constraints
	const minItems = (schema as any).minItems || 0;
	const maxItems = (schema as any).maxItems;
	const hasMinItems = typeof minItems === 'number' && minItems > 0;
	const hasMaxItems = typeof maxItems === 'number';

	// For tuple arrays, the length is fixed
	const targetLength = isTupleArray ? tupleSchemas!.length : value.length;
	const canAddItems = !isTupleArray && (!hasMaxItems || value.length < maxItems);
	const canRemoveItems = !isTupleArray && (!hasMinItems || value.length > minItems);

	const handleItemChange = (index: number, itemValue: any) => {
		const newValue = [...value];
		newValue[index] = itemValue;
		onChange(newValue);
	};

	const handleAddItem = () => {
		if (!canAddItems || !itemSchema) return;

		// Generate a default value based on the item schema type
		let defaultValue: any;
		switch (itemSchema.type) {
			case 'string':
				defaultValue = '';
				break;
			case 'number':
			case 'integer':
				defaultValue = 0;
				break;
			case 'boolean':
				defaultValue = false;
				break;
			case 'object':
				defaultValue = {};
				break;
			case 'array':
				defaultValue = [];
				break;
			default:
				defaultValue = null;
		}

		onChange([...value, defaultValue]);
	};

	const handleRemoveItem = (index: number) => {
		if (!canRemoveItems) return;
		const newValue = value.filter((_, i) => i !== index);
		onChange(newValue);
	};

	const handleMoveItem = (fromIndex: number, toIndex: number) => {
		if (isTupleArray) return; // Can't reorder tuple arrays

		const newValue = [...value];
		const [movedItem] = newValue.splice(fromIndex, 1);
		newValue.splice(toIndex, 0, movedItem);
		onChange(newValue);
	};

	// Ensure we have enough items for tuple arrays or min items
	const displayLength = Math.max(targetLength, hasMinItems ? minItems : 0);

	const renderExpandToggle = () => (
		<Button
			variant='ghost'
			type='button'
			size='sm'
			onClick={() => setIsExpanded(!isExpanded)}
			className='h-auto p-1 text-muted-foreground hover:text-foreground'
		>
			{isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
		</Button>
	);

	return (
		<div className='space-y-3'>
			{/* Array Header */}
			<div className='flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2'>
				<div className='flex items-center gap-2'>
					{renderExpandToggle()}
					<span className='text-sm font-medium'>
						{isTupleArray ? 'Tuple Array' : 'Array'} {path && `(${path})`}
					</span>
					<span className='text-xs text-muted-foreground'>
						{value.length} item{value.length !== 1 ? 's' : ''}
					</span>
				</div>
				<div className='flex items-center gap-2'>
					{hasMinItems && <span className='text-xs text-orange-600'>min: {minItems}</span>}
					{hasMaxItems && <span className='text-xs text-orange-600'>max: {maxItems}</span>}
					{!isTupleArray && canAddItems && (
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={handleAddItem}
							disabled={disabled}
							className='h-7 px-2'
						>
							<Plus className='h-3 w-3' />
							Add Item
						</Button>
					)}
				</div>
			</div>

			{/* Array Items */}
			{isExpanded && (
				<div className='space-y-2'>
					{Array.from({ length: displayLength }, (_, index) => {
						const itemValue = value[index];
						const currentItemSchema = isTupleArray ? tupleSchemas![index] : itemSchema!;

						const itemPath = path ? `${path}[${index}]` : `[${index}]`;
						const isOptional = !isTupleArray && index >= minItems;

						return (
							<div
								key={index}
								className='group relative rounded-md border border-muted/50 bg-background py-1 pl-3'
								draggable={!isTupleArray && !disabled}
								onDragStart={() => setDraggedIndex(index)}
								onDragEnd={() => setDraggedIndex(null)}
								onDragOver={(e) => e.preventDefault()}
								onDrop={(e) => {
									e.preventDefault();
									if (draggedIndex !== null && draggedIndex !== index) {
										handleMoveItem(draggedIndex, index);
									}
								}}
							>
								{/* Item Header */}
								<div className='mb-2 flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										{!isTupleArray && <GripVertical className='h-4 w-4 cursor-move text-muted-foreground' />}
										<span className='text-sm font-medium text-muted-foreground'>Item {index + 1}</span>
										{currentItemSchema?.type && (
											<span className='text-[11px] text-muted-foreground/70'>({currentItemSchema.type})</span>
										)}
										{isOptional && <span className='text-[11px] text-blue-600'>optional</span>}
									</div>

									{!isTupleArray && canRemoveItems && isOptional && (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleRemoveItem(index)}
											disabled={disabled}
											className='h-6 w-6 p-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100'
										>
											<Trash2 className='h-3 w-3' />
										</Button>
									)}
								</div>

								{/* Item Field */}
								<FormItem>
									<FormControl>
										<SchemaField
											schema={currentItemSchema}
											value={itemValue}
											onChange={(itemValue) => handleItemChange(index, itemValue)}
											disabled={disabled}
											depth={depth + 1}
											path={itemPath}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							</div>
						);
					})}
				</div>
			)}

			{/* Empty State */}
			{isExpanded && value.length === 0 && !hasMinItems && (
				<div className='flex flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-8 text-center'>
					<p className='mb-3 text-sm text-muted-foreground'>No items in array</p>
					{canAddItems && (
						<Button type='button' variant='outline' size='sm' onClick={handleAddItem} disabled={disabled}>
							<Plus className='mr-2 h-4 w-4' />
							Add First Item
						</Button>
					)}
				</div>
			)}

			{/* Constraints Info */}
			{(hasMinItems || hasMaxItems) && (
				<div className='mt-2 text-xs text-muted-foreground'>
					{hasMinItems && hasMaxItems && (
						<span>
							Array must have {minItems}-{maxItems} items
						</span>
					)}
					{hasMinItems && !hasMaxItems && (
						<span>
							Array must have at least {minItems} item{minItems !== 1 ? 's' : ''}
						</span>
					)}
					{!hasMinItems && hasMaxItems && (
						<span>
							Array can have at most {maxItems} item{maxItems !== 1 ? 's' : ''}
						</span>
					)}
				</div>
			)}
		</div>
	);
};
