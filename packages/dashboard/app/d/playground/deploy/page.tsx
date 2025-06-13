'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeliverTxResponse } from 'hyperwebjs/types';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { GoGear } from 'react-icons/go';
import { z } from 'zod';

import { useContracts } from '@/hooks/contract/use-contracts';
import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { useInstantiateTx } from '@/hooks/contract/use-instantiate-tx';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { getInstantiateResponse, readFileContent } from '@/lib/contract/deploy';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Combobox } from '@/components/contract/combobox';
import { DeployResult } from '@/components/contract/deploy/deploy-result';
import { FileUploader } from '@/components/contract/deploy/file-uploader';
import { getOutputJsContracts } from '@/components/contract/editor/contract-editor.utils';
import { useContractProject } from '@/components/contract/editor/hooks/use-contract-project';
import { contractSourceStoreActions } from '@/contexts/contract-source';
import { useSavedContracts } from '@/contexts/saved-contracts';

const formSchema = z.object({
  contractSource: z
    .discriminatedUnion('type', [
      z.object({
        type: z.literal('select'),
        contractId: z.string().min(1),
      }),
      z.object({
        type: z.literal('upload'),
        file: z.instanceof(File).optional(),
        sourceFile: z.instanceof(File).optional(),
      }),
    ])
    .refine(
      (data) => {
        if (data.type === 'upload') {
          return data.file instanceof File;
        }
        return true;
      },
      {
        message: 'Contract file is required for upload',
      }
    ),
  contractLabel: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

function Deploy() {
  const [txResult, setTxResult] = useState<DeliverTxResponse>();
  const items = useContractProject((state) => state.items);
  const getItemById = useContractProject((state) => state.getItemById);
  const { saveContract } = useSavedContracts();
  const { isBelowSm } = useBreakpoint('sm');

  const outputContracts = useMemo(() => getOutputJsContracts(items), [items]);

  const [contractId] = useQueryState('contractId');

  const { instantiateTx } = useInstantiateTx();
  const { address, connect } = useHyperwebChain();
  const { refetch: updateContracts } = useContracts();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      contractSource: {
        type: 'select',
        contractId: '',
      },
      contractLabel: '',
    },
  });

  const {
    formState: { isValid, isSubmitting },
    setValue: setFormValue,
  } = form;

  const updateLabelValue = useCallback(
    (name: string) => {
      const labelValue = name.replace(/\.js$/, '');
      setFormValue('contractLabel', labelValue);
    },
    [setFormValue]
  );

  useEffect(() => {
    if (contractId) {
      const selectedContract = getItemById(contractId, 'file');

      if (selectedContract && selectedContract.path.startsWith('dist/') && selectedContract.path.endsWith('.js')) {
        setFormValue(
          'contractSource',
          {
            type: 'select',
            contractId: selectedContract.id,
          },
          { shouldValidate: true }
        );

        updateLabelValue(selectedContract.path.split('/').pop() || selectedContract.path);
      }
    }
  }, [contractId, updateLabelValue]);

  async function onSubmit(values: FormSchema) {
    let code: string;
    let source: string | undefined = undefined;
    const { contractSource, contractLabel } = values;

    if (contractSource.type === 'upload') {
      if (!contractSource.file) {
        throw new Error('Contract file is required for upload');
      }
      code = await readFileContent(contractSource.file);
      // Source file is optional for upload
      if (contractSource.sourceFile) {
        source = await readFileContent(contractSource.sourceFile);
      }
    } else {
      const selectedContract = getItemById(contractSource.contractId, 'file');
      code = selectedContract?.content ?? '';

      // Get source files from store using the contract's path
      if (selectedContract) {
        const sourceFiles = contractSourceStoreActions.getSourceFiles(selectedContract.path);
        if (sourceFiles && Object.keys(sourceFiles).length > 0) {
          source = JSON.stringify(sourceFiles, null, 2);
        }
      }
    }

    await instantiateTx({
      address,
      code,
      source,
      onTxSucceed: (txInfo) => {
        if (txInfo.code !== 0) {
          throw new Error(txInfo.rawLog);
        }
        setTxResult(txInfo);
        updateContracts();

        const { data: instantiateResponse, error } = getInstantiateResponse(txInfo);

        if (error) {
          logger.error('Failed to parse instantiate response:', error);
        }

        const { index, address: contractAddress } = instantiateResponse || { index: 0, address: '' };
        saveContract(address, index.toString(), contractAddress, contractLabel ?? '');
      },
    });
  }

  if (txResult) {
    return (
      <DeployResult
        txResult={txResult}
        onBack={() => {
          setTxResult(undefined);
          form.reset();
        }}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-8">
      <h1 className="text-center text-fluid-2xl font-medium">Deploy Contract</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="contractSource"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Contract File</FormLabel>

                  <Tabs
                    defaultValue="select"
                    onValueChange={(value) => {
                      field.onChange({
                        type: value,
                      });

                      setFormValue('contractLabel', '');
                    }}
                  >
                    <TabsList className="my-6 grid w-full grid-cols-2">
                      <TabsTrigger value="select">{isBelowSm ? 'Select' : 'Select from your contracts'}</TabsTrigger>
                      <TabsTrigger value="upload">{isBelowSm ? 'Upload' : 'Upload JS contract'}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="select" className="mb-4 space-y-2">
                      <FormLabel className="text-sm">Select Contract</FormLabel>
                      <FormControl>
                        <Combobox
                          options={outputContracts.map((contract) => ({
                            value: contract.id,
                            label: contract.path.split('/').pop() || contract.path,
                          }))}
                          value={field.value.type === 'select' ? field.value.contractId : ''}
                          displayMode="label"
                          onChange={(value) => {
                            // When a contract is selected, update the label
                            const selectedContract = getItemById(value, 'file');

                            field.onChange({
                              type: 'select',
                              contractId: value,
                            });

                            if (selectedContract) {
                              updateLabelValue(selectedContract.path.split('/').pop() || selectedContract.path);
                            }
                          }}
                          placeholder="Select contract"
                        />
                      </FormControl>
                      <FormDescription>Select a contract from your compiled contracts.</FormDescription>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel className="text-sm">Contract File</FormLabel>
                        <FormControl>
                          <FileUploader
                            file={field.value.type === 'upload' ? field.value.file : undefined}
                            fileTypes={['js']}
                            onFileChange={(file) => {
                              if (file) {
                                field.onChange({
                                  type: 'upload',
                                  file,
                                  sourceFile: field.value.type === 'upload' ? field.value.sourceFile : undefined,
                                });
                                updateLabelValue(file.name);
                              } else {
                                // Handle file removal
                                field.onChange({
                                  type: 'upload',
                                  file: undefined,
                                  sourceFile: field.value.type === 'upload' ? field.value.sourceFile : undefined,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </div>

                      <div className="space-y-2">
                        <FormLabel className="text-sm">Source File (Optional)</FormLabel>
                        <FormControl>
                          <FileUploader
                            file={field.value.type === 'upload' ? field.value.sourceFile : undefined}
                            fileTypes={['json']}
                            onFileChange={(file) => {
                              if (file) {
                                field.onChange({
                                  type: 'upload',
                                  file: field.value.type === 'upload' ? field.value.file : undefined,
                                  sourceFile: file,
                                });
                              } else {
                                // Handle file removal
                                field.onChange({
                                  type: 'upload',
                                  file: field.value.type === 'upload' ? field.value.file : undefined,
                                  sourceFile: undefined,
                                });
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload a JSON file that maps contract TypeScript filenames to their source code content.
                        </FormDescription>
                      </div>
                    </TabsContent>
                  </Tabs>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="contractLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a contract label" {...field} />
                </FormControl>
                <FormDescription>
                  Add a brief label to describe what the contract does. The label will be stored locally.
                </FormDescription>
              </FormItem>
            )}
          />

          {address ? (
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
              disabled={!isValid || isSubmitting}
              spinner={isSubmitting && <GoGear className="size-5 animate-spin" />}
              showContentWhileLoading
            >
              {isSubmitting ? 'Deploying' : 'Deploy'}
            </Button>
          ) : (
            <Button type="button" className="w-full" size="lg" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

export default Deploy;
