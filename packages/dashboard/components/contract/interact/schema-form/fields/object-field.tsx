'use client';

import { useState } from 'react';
import { JSONSchema } from '@hyperweb/parse';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SchemaField } from '../schema-field';

interface ObjectFieldProps {
  schema: JSONSchema;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
  depth?: number;
  path?: string;
}

const MAX_DEPTH = 5; // Prevent infinite recursion

// Helper function to check if a field value is truly filled based on its schema
const isFieldFilled = (fieldValue: any, fieldSchema: JSONSchema): boolean => {
  // If value is undefined or null, it's not filled
  if (fieldValue === undefined || fieldValue === null) {
    return false;
  }

  // For primitive types, check if value is not empty
  if (fieldSchema.type === 'string') {
    return fieldValue !== '';
  }

  if (fieldSchema.type === 'number' || fieldSchema.type === 'integer') {
    return fieldValue !== '' && !isNaN(fieldValue);
  }

  if (fieldSchema.type === 'boolean') {
    return fieldValue !== undefined;
  }

  // For objects, check if all required fields are filled
  if (fieldSchema.type === 'object' && fieldSchema.properties) {
    const requiredFields = fieldSchema.required || [];

    // If no required fields, consider it filled if it has any meaningful content
    if (requiredFields.length === 0) {
      return Object.keys(fieldValue).length > 0;
    }

    // Check if all required fields are present and filled
    return requiredFields.every((requiredField) => {
      const nestedSchema = fieldSchema.properties![requiredField];
      const nestedValue = fieldValue[requiredField];
      return nestedSchema && isFieldFilled(nestedValue, nestedSchema);
    });
  }

  // For arrays, check if not empty and all items are valid
  if (fieldSchema.type === 'array') {
    if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
      return false;
    }
    // For arrays, we consider them filled if they have at least one item
    return true;
  }

  // For other types, consider filled if not empty
  return fieldValue !== '';
};

export const ObjectField = ({ schema, value = {}, onChange, disabled, depth = 0, path = '' }: ObjectFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first 2 levels

  // Prevent infinite recursion
  if (depth >= MAX_DEPTH) {
    return (
      <div className="flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4">
        <p className="text-sm text-muted-foreground">Max nesting depth reached</p>
      </div>
    );
  }

  if (!schema.properties) {
    return (
      <div className="flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 p-4">
        <p className="text-sm text-muted-foreground">Object schema has no properties defined</p>
      </div>
    );
  }

  const properties = schema.properties;
  const requiredFields = schema.required || [];

  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    const newValue = { ...value };
    if (fieldValue === undefined || fieldValue === '') {
      delete newValue[fieldName];
    } else {
      // Keep null values since they might be intentional for nullable fields
      newValue[fieldName] = fieldValue;
    }
    onChange(newValue);
  };

  const renderExpandToggle = () => (
    <Button
      variant="ghost"
      type="button"
      size="sm"
      onClick={() => setIsExpanded(!isExpanded)}
      className="h-auto p-1 text-muted-foreground hover:text-foreground"
    >
      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
  );

  const propertyCount = Object.keys(properties).length;
  // Count only truly filled fields
  const filledCount = Object.entries(properties).filter(([fieldName, fieldSchema]) => {
    return isFieldFilled(value[fieldName], fieldSchema);
  }).length;

  return (
    <div className="space-y-3">
      {/* Header with expand/collapse toggle */}
      <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2">
          {renderExpandToggle()}
          <span className="text-sm font-medium">Object {path && `(${path})`}</span>
          <span className="text-xs text-muted-foreground">
            {filledCount} of {propertyCount} fields
          </span>
        </div>
      </div>

      {/* Nested fields */}
      {isExpanded && (
        <div className="space-y-4 border-l-2 border-muted pl-4">
          {Object.entries(properties).map(([fieldName, fieldSchema]) => {
            const isRequired = requiredFields.includes(fieldName);
            const fieldPath = path ? `${path}.${fieldName}` : fieldName;

            return (
              <FormItem key={fieldName}>
                <FormLabel>
                  <span className="text-sm">{fieldName}</span>
                  {isRequired && <span className="ml-1 text-destructive">*</span>}
                  {fieldSchema.type && (
                    <span className="ml-1 text-[13px] font-normal text-muted-foreground">({fieldSchema.type})</span>
                  )}
                </FormLabel>
                <FormControl>
                  <SchemaField
                    schema={fieldSchema}
                    value={value[fieldName]}
                    onChange={(fieldValue) => handleFieldChange(fieldName, fieldValue)}
                    disabled={disabled}
                    depth={depth + 1}
                    path={fieldPath}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          })}
        </div>
      )}
    </div>
  );
};
