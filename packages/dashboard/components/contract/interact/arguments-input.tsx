'use client';

import { useState } from 'react';
import { JSONSchema, SchemaMethodInfo } from '@hyperweb/parse';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { JsonEditor } from './json-editor';
import { SchemaFormGenerator } from './schema-form/schema-form-generator';

interface ArgumentsInputProps {
  value: string;
  onChange: (value: string) => void;
  argsSchema?: JSONSchema;
  selectedMethod?: SchemaMethodInfo;
  disabled?: boolean;
}

export const ArgumentsInput = ({ value, onChange, argsSchema, selectedMethod, disabled }: ArgumentsInputProps) => {
  const [inputMode, setInputMode] = useState<'json' | 'form'>('json');

  // Parse current JSON value for form fields
  const parseValueForForm = () => {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Convert form values back to JSON string
  const handleFormChange = (formValues: any[]) => {
    try {
      const jsonString = JSON.stringify(formValues, null, 2);
      onChange(jsonString);
    } catch {
      onChange('[]');
    }
  };

  return (
    <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as 'json' | 'form')}>
      <TabsList variant="underline" className="w-full">
        <TabsTrigger variant="underline" value="json">
          JSON Editor
        </TabsTrigger>
        <TabsTrigger variant="underline" value="form">
          Schema Form
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="json" className="mt-0">
          <JsonEditor value={value} onChange={onChange} argsSchema={argsSchema} />
        </TabsContent>

        <TabsContent value="form" className="mb-2 mt-0">
          <div className="flex min-h-[240px] flex-col rounded-md border border-input bg-background p-4">
            <SchemaFormGenerator
              schema={argsSchema}
              selectedMethod={selectedMethod}
              value={parseValueForForm()}
              onChange={handleFormChange}
              disabled={disabled}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
