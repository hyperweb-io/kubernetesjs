'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useQueryState } from 'nuqs';

import { useContractMethods } from '@/hooks/contract/use-contract-methods';
import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { useExecuteContractForm, useQueryContractForm } from '@/hooks/contract/use-interact-form';
import { formatDetailedType, formatFunctionSignature } from '@/lib/contract/interact';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArgumentsInput } from '@/components/contract/interact/arguments-input';
import { ContractAddressField } from '@/components/contract/interact/contract-address-field';
import { JsonEditor } from '@/components/contract/interact/json-editor';
import { MethodSuggestions } from '@/components/contract/interact/method-suggestions';

function Interact() {
  const { address, connect } = useHyperwebChain();
  const [showSignature, setShowSignature] = useState(false);

  const [addressParam] = useQueryState('address');

  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'query',
    parse: (value) => (value === 'execute' ? 'execute' : 'query'),
    serialize: (value) => value,
    shallow: false,
  });

  const queryForm = useQueryContractForm({ initContractAddress: addressParam || undefined });
  const executeForm = useExecuteContractForm({ initContractAddress: addressParam || undefined });

  const currentForm = tab === 'query' ? queryForm : executeForm;

  const isContractAddressValid = !currentForm.form.formState.errors.contractAddress;

  const {
    data: contractMethods,
    isLoading: isLoadingMethods,
    error: methodsError,
  } = useContractMethods({
    contractAddress: currentForm.form.watch('contractAddress'),
    enabled: isContractAddressValid,
  });

  const suggestedMethods = useMemo(() => {
    if (!contractMethods || !currentForm.form.watch('contractAddress')) return [];
    return tab === 'query' ? contractMethods.queries : contractMethods.mutations;
  }, [contractMethods, tab, currentForm.form.watch('contractAddress')]);

  const suggestedMethodsWithSchema = useMemo(() => {
    if (!contractMethods || !currentForm.form.watch('contractAddress')) return [];
    return tab === 'query' ? contractMethods.queries : contractMethods.mutations;
  }, [contractMethods, tab, currentForm.form.watch('contractAddress')]);

  const selectedMethod = useMemo(() => {
    const callee = currentForm.form.watch('callee');
    if (!callee || !suggestedMethodsWithSchema) return undefined;
    return suggestedMethodsWithSchema.find((method) => method.name === callee);
  }, [currentForm.form.watch('callee'), suggestedMethodsWithSchema]);

  const selectedMethodSchema = useMemo(() => {
    if (!selectedMethod || !selectedMethod.params) return undefined;

    // Handle functions with no parameters
    if (selectedMethod.params.length === 0) {
      return {
        type: 'array',
        maxItems: 0,
      };
    }

    // Create a tuple array schema from the method parameters
    // This ensures JSONSchemaFaker generates exactly the right number of args in the right order
    return {
      type: 'array',
      items: selectedMethod.params.map((param) => param.schema),
      minItems: selectedMethod.params.length,
      maxItems: selectedMethod.params.length,
    };
  }, [selectedMethod]);

  // Reset args when selected method changes
  useEffect(() => {
    const callee = currentForm.form.watch('callee');
    if (callee) {
      currentForm.form.setValue('args', '[]');
      currentForm.handleArgsChange('[]');
    }
  }, [currentForm.form.watch('callee')]);

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-8">
      <h1 className="text-center text-fluid-2xl font-medium">Interact with Contract</h1>

      <Form {...currentForm.form}>
        <form onSubmit={currentForm.onSubmit} className="w-full space-y-6">
          <ContractAddressField />

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="execute">Execute</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <FormField
                  control={currentForm.form.control}
                  name="callee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract function</FormLabel>
                      {currentForm.form.watch('contractAddress') && isContractAddressValid && (
                        <MethodSuggestions
                          methods={suggestedMethods.map((method) => method.name)}
                          isLoading={isLoadingMethods}
                          error={methodsError as string | null}
                          onMethodClick={currentForm.handleMethodClick}
                          selectedMethod={currentForm.form.watch('callee')}
                        />
                      )}
                      <FormControl>
                        <Input
                          {...field}
                          value={currentForm.localState.callee}
                          onChange={(e) => {
                            field.onChange(e);
                            currentForm.handleCalleeChange(e.target.value);
                          }}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>Provide the name of the contract function to call.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={currentForm.form.control}
                  name="args"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arguments</FormLabel>
                      <FormDescription>JSON array of arguments in parameter order.</FormDescription>

                      {selectedMethod && (
                        <div className={cn('space-y-2', showSignature && 'pb-2')}>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setShowSignature(!showSignature)}
                            className="px-0 py-2 text-sm text-body-text"
                          >
                            {showSignature ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            {showSignature ? 'Hide' : 'Show'} function signature
                          </Button>

                          {showSignature && (
                            <Card>
                              <CardContent className="p-3">
                                <div className="space-y-2">
                                  <div className="text-sm font-medium text-foreground">Function Signature:</div>
                                  <code className="block rounded-lg bg-foreground/5 p-2 font-mono text-sm">
                                    {formatFunctionSignature(selectedMethod)}
                                  </code>
                                  {selectedMethod.params && selectedMethod.params.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="text-xs font-medium text-muted-foreground">Parameters:</div>
                                      {selectedMethod.params.map((param: any, index: number) => (
                                        <div key={index} className="text-xs text-muted-foreground">
                                          <code className="font-semibold">{param.name || `arg${index}`}</code>:{' '}
                                          <code className="text-muted-foreground">
                                            {formatDetailedType(param.schema)}
                                          </code>
                                          {param.description && (
                                            <span className="ml-2 text-muted-foreground/70">- {param.description}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}

                      <FormControl>
                        <ArgumentsInput
                          value={currentForm.localState.args}
                          onChange={(value: string) => {
                            field.onChange(value);
                            currentForm.handleArgsChange(value);
                          }}
                          argsSchema={selectedMethodSchema as any}
                          selectedMethod={selectedMethod}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {tab === 'execute' && !address ? (
                  <Button type="button" className="w-full" size="lg" onClick={connect}>
                    Connect Wallet
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!currentForm.isValid || currentForm.isLoading}
                  >
                    {tab === 'query' ? 'Query' : 'Execute'}
                  </Button>
                )}

                <FormItem>
                  <FormLabel>Return Output</FormLabel>
                  <JsonEditor
                    readOnly
                    value={currentForm.result}
                    showLineHighlight={false}
                    containerClassName={cn(!currentForm.isSuccess && 'border-destructive')}
                  />
                </FormItem>
              </div>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}

export default Interact;
