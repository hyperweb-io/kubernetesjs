'use client';

import { useState } from 'react';
import { AlertCircle, Check, CircleCheck, Loader2, PencilLine, X } from 'lucide-react';
import { ControllerFieldState, useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { shortenAddress } from '@/lib/chain';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSavedContracts } from '@/contexts/saved-contracts';

import { Combobox } from '../combobox';

type Status = 'valid' | 'invalid' | 'loading';

const getFieldStatus = (
  fieldState: ControllerFieldState,
  isSubmitting: boolean
): { status: Status; message: string } => {
  const { invalid, isValidating, error } = fieldState;
  if (isValidating && !isSubmitting)
    return {
      status: 'loading',
      message: 'Checking contract address...',
    };
  if (!invalid || isSubmitting)
    return {
      status: 'valid',
      message: 'Valid contract address',
    };
  return {
    status: 'invalid',
    message: error?.message || 'Unknown error',
  };
};

const getStatusStyles = (
  status: Status
): {
  icon: React.ReactNode;
  className?: string;
} => {
  if (status === 'loading')
    return {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    };
  if (status === 'valid')
    return {
      icon: <CircleCheck className="h-4 w-4 text-green-500" />,
    };
  return {
    icon: <AlertCircle className="h-4 w-4" />,
    className: 'text-destructive',
  };
};

export const ContractAddressField = () => {
  const form = useFormContext();
  const { getAllContracts, updateLabel } = useSavedContracts();
  const { isBelowSm } = useBreakpoint('sm');
  const { address } = useHyperwebChain();

  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState('');

  const debouncedFormUpdate = useDebouncedCallback((value: string) => {
    form.setValue('contractAddress', value, { shouldValidate: true });
  }, 300);

  // Check if the value is from saved contracts (dropdown selection)
  const isValidSavedContract = (value: string) => {
    return getAllContracts(address).some((contract) => contract.contractAddress === value);
  };

  // Simplified change handler
  const handleChange = (value: string) => {
    if (value === '' || isValidSavedContract(value)) {
      // Immediate update for: clearing, dropdown selection
      form.setValue('contractAddress', value, { shouldValidate: true });
    } else {
      // Debounced update for manual typing
      debouncedFormUpdate(value);
    }
  };

  const startEditing = (index: string, currentLabel: string) => {
    setEditingIndex(index);
    setLabelInput(currentLabel);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setLabelInput('');
  };

  const saveLabel = (index: string) => {
    if (labelInput.trim()) {
      updateLabel(address, index, labelInput);
    }
    setEditingIndex(null);
  };

  return (
    <FormField
      control={form.control}
      name="contractAddress"
      render={({ field, fieldState, formState }) => {
        const { status, message } = getFieldStatus(fieldState, formState.isSubmitting);
        const { icon, className } = getStatusStyles(status);

        return (
          <FormItem>
            <FormLabel>Contract Address</FormLabel>
            <FormControl>
              <Combobox
                options={getAllContracts(address).map(({ contractAddress, label, index }) => ({
                  value: contractAddress,
                  label: `${label} ${contractAddress}`, // filter options by label and contract address
                  metadata: { index, label },
                }))}
                renderOption={(option) => {
                  const { index = '', label = '' } = option.metadata || {};
                  const isEditing = editingIndex === index;

                  return (
                    <div className="grid w-full grid-cols-2 items-center gap-2">
                      <span className="truncate text-sm">{shortenAddress(option.value, isBelowSm ? 6 : 10)}</span>
                      <div className="group flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex w-full items-center gap-1">
                            <Input
                              value={labelInput}
                              onChange={(e) => setLabelInput(e.target.value)}
                              placeholder="Enter label"
                              className="h-7"
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-input/40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveLabel(index);
                                }}
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-input/40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEditing();
                                }}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="truncate font-medium">{label || 'Untitled contract'}</span>
                            <PencilLine
                              className="h-4 w-4 min-w-4 cursor-pointer opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(index, label);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                }}
                optionsHeader={
                  <div className="grid grid-cols-2 gap-2 px-4 pb-1 pt-2 text-xs font-normal text-muted-foreground">
                    <span>Contract Address</span>
                    <span>Contract Label</span>
                  </div>
                }
                value={field.value}
                onChange={handleChange}
                placeholder="Select a contract"
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    cancelEditing();
                  }
                }}
              />
            </FormControl>
            {field.value && (
              <FormDescription className={cn('flex items-center gap-2', className)}>
                {icon}
                {message}
              </FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
};
