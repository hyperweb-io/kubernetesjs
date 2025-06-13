import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeliverTxResponse } from 'hyperwebjs/types';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import { getEvalResponse } from '@/lib/contract/deploy';
import { isValidJson } from '@/lib/contract/interact';
import { safeJSONParse } from '@/lib/utils';
import { useInteractFormStore } from '@/contexts/interact-form';

import { useContractAddressSchema } from './use-contract-address-schema';
import { useExecuteContractTx } from './use-execute-contract-tx';
import { useHyperwebChain } from './use-hyperweb-chain';
import { useQueryContract } from './use-query-contract';

const otherFieldsSchema = z.object({
  callee: z.string().min(1, 'Contract function name is required'),
  args: z
    .string()
    .optional()
    .refine((val) => isValidJson(val ?? '', { allowEmpty: true }).isValid),
});

/**
 * Helper function to convert all array elements to strings
 * This ensures contract arguments are properly string-encoded
 */
function stringifyArgs(args: unknown[]): string[] {
  return args.map((arg) => {
    if (typeof arg === 'string') {
      return arg;
    }
    // Convert any non-string values to JSON strings
    return JSON.stringify(arg);
  });
}

// Singleton cleanup to prevent double clearing when both hooks are used
let cleanupExecuted = false;

/**
 * Helper function to handle JSON parsing form errors
 */
function useJsonParsingFormError(form: UseFormReturn<any>, error: Error | null, fieldName: string) {
  useEffect(() => {
    if (error) {
      form.setError(fieldName, {
        type: 'manual',
        message: `Invalid JSON: ${error.message}`,
      });
    } else {
      form.clearErrors(fieldName);
    }
  }, [error, form, fieldName]);
}

export const useQueryContractForm = (options?: { initContractAddress?: string }) => {
  const { schema: contractAddressSchema } = useContractAddressSchema();
  const formSchema = useMemo(() => contractAddressSchema.merge(otherFieldsSchema), [contractAddressSchema]);
  type FormSchema = z.infer<typeof formSchema>;

  const { contractAddress, setContractAddress, clearContractAddress } = useInteractFormStore();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      contractAddress: '',
      callee: '',
      args: '[]',
    },
  });

  const { data: parsedArgs, error: parsedArgsError } = safeJSONParse(form.watch('args') || '[]');

  // Set form error when JSON parsing fails
  useJsonParsingFormError(form, parsedArgsError, 'args');

  const {
    data: queryResult,
    refetch: queryContract,
    error: queryContractError,
    isFetching,
  } = useQueryContract({
    contractAddress: form.watch('contractAddress'),
    callee: form.watch('callee'),
    args: parsedArgs ? stringifyArgs(parsedArgs) : [],
    enabled: false,
  });

  const prevResultRef = useRef('');
  const hasSubmittedRef = useRef(false);

  // Clear contract address and result when component unmounts (only once)
  useEffect(() => {
    cleanupExecuted = false; // Reset on mount
    return () => {
      if (!cleanupExecuted) {
        clearContractAddress();
        prevResultRef.current = ''; // Clear result when navigating away
        hasSubmittedRef.current = false; // Clear submission state
        cleanupExecuted = true;
      }
    };
  }, [clearContractAddress]);

  // Reset submission state when form values change
  useEffect(() => {
    hasSubmittedRef.current = false;
  }, [form.watch('contractAddress'), form.watch('callee'), form.watch('args')]);

  // Initialize contract address from options
  useEffect(() => {
    if (options?.initContractAddress) {
      setContractAddress(options.initContractAddress);
    }
  }, [options?.initContractAddress, setContractAddress]);

  // Sync form with shared store
  useEffect(() => {
    form.setValue('contractAddress', contractAddress, { shouldValidate: !!contractAddress });
  }, [contractAddress, form]);

  // Update store when form contract address changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'contractAddress' && value.contractAddress !== contractAddress) {
        setContractAddress(value.contractAddress || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, contractAddress, setContractAddress]);

  const handleMethodClick = useCallback(
    (methodName: string) => {
      form.setValue('callee', methodName, { shouldValidate: true });
    },
    [form]
  );

  const result = useMemo(() => {
    if (!hasSubmittedRef.current) {
      return ''; // Don't show any results until explicitly submitted
    }

    if (isFetching) {
      return prevResultRef.current;
    } else {
      const newResult = queryResult
        ? JSON.stringify(queryResult, null, 2)
        : queryContractError
        ? (queryContractError as Error)?.message || 'Unknown error'
        : '';

      prevResultRef.current = newResult;
      return newResult;
    }
  }, [isFetching, queryResult, queryContractError]);

  const isSuccess = useMemo(() => {
    return isValidJson(result ?? '', { allowEmpty: true }).isValid;
  }, [result]);

  const onSubmit = useCallback(async () => {
    hasSubmittedRef.current = true; // Mark as submitted
    await queryContract();
  }, [queryContract]);

  return {
    form,
    isLoading: isFetching,
    isValid: form.formState.isValid,
    result,
    isSuccess,
    onSubmit: form.handleSubmit(onSubmit),
    handleMethodClick,
  };
};

export const useExecuteContractForm = (options?: { initContractAddress?: string }) => {
  const { toast } = useToast();
  const { schema: contractAddressSchema } = useContractAddressSchema();
  const formSchema = useMemo(() => contractAddressSchema.merge(otherFieldsSchema), [contractAddressSchema]);
  type FormSchema = z.infer<typeof formSchema>;

  const { contractAddress, setContractAddress } = useInteractFormStore();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      contractAddress: '',
      callee: '',
      args: '[]',
    },
  });

  const { data: parsedExecuteArgs, error: parsedExecuteArgsError } = safeJSONParse(form.watch('args') || '[]');

  // Set form error when JSON parsing fails
  useJsonParsingFormError(form, parsedExecuteArgsError, 'args');

  // Initialize contract address from options
  useEffect(() => {
    if (options?.initContractAddress) {
      setContractAddress(options.initContractAddress);
    }
  }, [options?.initContractAddress, setContractAddress]);

  // Sync form with shared store
  useEffect(() => {
    form.setValue('contractAddress', contractAddress, { shouldValidate: !!contractAddress });
  }, [contractAddress, form]);

  // Update store when form contract address changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'contractAddress' && value.contractAddress !== contractAddress) {
        setContractAddress(value.contractAddress || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, contractAddress, setContractAddress]);

  const handleMethodClick = useCallback(
    (methodName: string) => {
      form.setValue('callee', methodName, { shouldValidate: true });
    },
    [form]
  );

  const { executeContractTx } = useExecuteContractTx();
  const { address } = useHyperwebChain();
  const [txResult, setTxResult] = useState<DeliverTxResponse>();

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      if (!address) return;

      if (parsedExecuteArgsError) {
        return toast({
          title: 'Invalid JSON',
          description: 'Please check your JSON input and try again.',
          variant: 'destructive',
        });
      }

      // Reset previous result/error before new execution
      setTxResult(undefined);

      await executeContractTx({
        creator: address,
        contractAddress: values.contractAddress,
        callee: values.callee,
        args: parsedExecuteArgs ? stringifyArgs(parsedExecuteArgs) : [],
        onTxSucceed: (res) => {
          setTxResult(res);
        },
      });
    },
    [address, executeContractTx, parsedExecuteArgs, parsedExecuteArgsError, toast]
  );

  const executeResult = useMemo(() => {
    if (!txResult) return '';

    const { data: evalResult, error } = getEvalResponse(txResult);

    if (error) {
      return `Proto parsing error: ${error.message} \n Raw log: ${txResult.rawLog}`;
    }

    return JSON.stringify(evalResult, null, 2);
  }, [txResult]);

  const isSuccess = useMemo(() => {
    return isValidJson(executeResult ?? '', { allowEmpty: true }).isValid;
  }, [executeResult]);

  return {
    form,
    isLoading: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    result: executeResult,
    isSuccess,
    onSubmit: form.handleSubmit(onSubmit),
    handleMethodClick,
  };
};
