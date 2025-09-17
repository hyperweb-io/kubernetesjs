'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { useHyperwebChainInfo } from '@/hooks/contract/use-hyperweb-chain-info';
import { getHyperwebConfig } from '@/configs/hyperweb-config';
import { useToast } from '@/hooks/use-toast';
import { creditFromFaucet } from '@/lib/contract/faucet';
import { createBech32AddressSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
function Faucet() {
  const config = getHyperwebConfig();

  const { data: chainInfo } = useHyperwebChainInfo();
  const { address, assetList } = useHyperwebChain();
  const { toast } = useToast();

  const formSchema = useMemo(() => {
    return z.object({
      address: createBech32AddressSchema(chainInfo?.chain.bech32Prefix ?? ''),
    });
  }, [chainInfo?.chain.bech32Prefix]);

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      address: '',
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  async function onSubmit(values: FormSchema) {
    const asset = assetList.assets[0];
    const faucetEndpoint = config?.chain.faucet;
    const faucetUrl = `${faucetEndpoint}/credit`;

    try {
      if (!faucetEndpoint) {
        throw new Error('Faucet endpoint is not set');
      }
      await creditFromFaucet(values.address, asset.base, faucetUrl);
      toast({
        variant: 'success',
        title: 'Tokens credited',
        duration: 3000,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to get tokens',
        description: error.message,
        duration: 5000,
      });
    }
  }

  return (
    <div className="mx-auto mt-16 flex max-w-[500px] flex-col items-center gap-8 sm:mt-24">
      <div className="text-center">
        <h1 className="mb-3 text-4xl font-medium sm:text-5xl">Faucet</h1>
        <p className="text-base font-medium text-body-text-secondary">Get some testnet tokens to your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <div className="flex w-full items-center space-x-2">
                    <FormControl>
                      <Input placeholder="Enter your wallet address" autoComplete="off" {...field} />
                    </FormControl>
                    <Button
                      variant="outline"
                      className="h-[40px]"
                      disabled={!address}
                      onClick={() => form.setValue('address', address ?? '', { shouldValidate: true })}
                      type="button"
                    >
                      Autofill
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full" size="lg" variant="secondary">
            Request Tokens
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Faucet;
