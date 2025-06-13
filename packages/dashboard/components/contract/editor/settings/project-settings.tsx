import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, FileDown, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import { capitalize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Divider } from '@/components/common/divider';

import { useContractProject } from '../hooks/use-contract-project';
import { variableFields } from './variable-fields';

interface VariableActionItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	buttonText: string;
	buttonVariant?: 'default' | 'destructive';
	onClick: () => void;
	disabled?: boolean;
}

function VariableActionItem({
	icon,
	title,
	description,
	buttonText,
	buttonVariant = 'default',
	onClick,
	disabled = false,
}: VariableActionItemProps) {
	return (
		<div className='flex items-start gap-4 rounded-lg border p-4'>
			<div className='mt-1'>{icon}</div>
			<div className='space-y-3'>
				<div>
					<h4 className='mb-1 text-[15px] font-medium'>{title}</h4>
					<p className='text-[13px] text-muted-foreground'>{description}</p>
				</div>
				<Button type='button' variant={buttonVariant} disabled={disabled} onClick={onClick}>
					{buttonText}
				</Button>
			</div>
		</div>
	);
}

const FormSectionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return (
		<div className={cn('space-y-2', className)}>
			<h3 className='font-semibold leading-tight tracking-tight'>{children}</h3>
			<Divider />
		</div>
	);
};

export function ProjectSettings() {
	const variables = useContractProject((state) => state.variables);
	const setVariableValues = useContractProject((state) => state.setVariableValues);
	const applyVariables = useContractProject((state) => state.applyVariables);
	const hasAppliedVariables = useContractProject((state) => state.hasAppliedVariables);
	const { toast } = useToast();

	const formSchema = z.object(
		variables.reduce(
			(acc, variable) => {
				const fieldInfo = variableFields.find((f) => f.variableName === variable.name);
				if (!fieldInfo) {
					console.error(`Variable ${variable.name} not found in variableFields`);
					return acc;
				}

				if (fieldInfo.type === 'list' && fieldInfo.choices) {
					acc[fieldInfo.fieldId] = z.enum(fieldInfo.choices as [string, ...string[]]);
				} else {
					acc[fieldInfo.fieldId] = z.string().min(1, `${fieldInfo.title} is required`);
				}
				return acc;
			},
			{} as Record<string, z.ZodString | z.ZodEnum<[string, ...string[]]>>,
		),
	);

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues: variables.reduce(
			(acc, variable) => {
				const fieldInfo = variableFields.find((f) => f.variableName === variable.name);
				if (fieldInfo) {
					if (fieldInfo.type === 'list' && fieldInfo.choices) {
						acc[fieldInfo.fieldId] = variable.value || fieldInfo.choices[0];
					} else {
						acc[fieldInfo.fieldId] = variable.value || '';
					}
				}
				return acc;
			},
			{} as Record<string, string>,
		),
	});

	const { isSubmitting, isValid } = form.formState;

	const getVariableValues = (formData: FormSchema) => {
		const variableValues: Record<string, string> = {};
		variables.forEach((variable) => {
			const fieldInfo = variableFields.find((f) => f.variableName === variable.name);
			if (fieldInfo && formData[fieldInfo.fieldId]) {
				variableValues[variable.name] = formData[fieldInfo.fieldId];
			}
		});
		return variableValues;
	};

	const handleApplyPermanently = () => {
		try {
			const formData = form.getValues();
			const variableValues = getVariableValues(formData);

			setVariableValues(variableValues);

			const result = applyVariables();
			if (!result.success) {
				throw new Error(result.error);
			}

			toast({
				title: 'Variables applied successfully',
				description: 'All variables have been replaced in your source files.',
				variant: 'success',
				duration: 2000,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Failed to apply variables',
				description: error instanceof Error ? error.message : 'Failed to apply variables',
				variant: 'destructive',
				duration: 4000,
			});
		}
	};

	const handleSaveForExport = () => {
		try {
			const formData = form.getValues();
			const variableValues = getVariableValues(formData);

			setVariableValues(variableValues);

			toast({
				title: 'Variables saved',
				description: 'Your variables have been saved for export.',
				variant: 'success',
				duration: 2000,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Save failed',
				description: error instanceof Error ? error.message : 'Failed to save variables',
				variant: 'destructive',
				duration: 4000,
			});
		}
	};

	return (
		<Form {...form}>
			<form className='space-y-6'>
				<div className='space-y-2 sm:space-y-6'>
					<FormSectionTitle>Project Variables</FormSectionTitle>
					{variables.map((variable) => {
						const fieldInfo = variableFields.find((f) => f.variableName === variable.name);
						if (!fieldInfo) return null;

						return (
							<FormField
								key={fieldInfo.fieldId}
								control={form.control}
								name={fieldInfo.fieldId}
								render={({ field }) => (
									<FormItem className='space-y-1 sm:grid sm:grid-cols-3 sm:space-y-0'>
										<FormLabel className='col-span-1 text-sm'>{fieldInfo.title}</FormLabel>
										<FormControl className='col-span-2'>
											<div className='flex flex-col gap-2'>
												{fieldInfo.type === 'list' && fieldInfo.choices && fieldInfo.choices.length > 1 ? (
													<RadioGroup
														onValueChange={field.onChange}
														defaultValue={field.value}
														className='flex flex-col gap-1'
														disabled={hasAppliedVariables}
													>
														{fieldInfo.choices.map((choice) => (
															<FormItem key={choice} className='flex items-center space-x-3 space-y-0'>
																<FormControl>
																	<RadioGroupItem value={choice} />
																</FormControl>
																<FormLabel className='text-sm font-normal'>{capitalize(choice)}</FormLabel>
															</FormItem>
														))}
													</RadioGroup>
												) : (
													<Input {...field} className='h-9' disabled={hasAppliedVariables} />
												)}
												<FormMessage />
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
						);
					})}
				</div>

				{hasAppliedVariables ? (
					<div className='flex items-center gap-2.5 rounded-lg bg-card px-4 py-3'>
						<div className='rounded-full bg-green-500/10 p-1'>
							<Check className='h-3.5 w-3.5 text-green-600' />
						</div>
						<p className='text-sm'>Variables have been applied to all source files.</p>
					</div>
				) : (
					<Card className='bg-transparent'>
						<CardHeader className='space-y-1 px-0 py-4'>
							<CardTitle>Apply Variables</CardTitle>
							<CardDescription>Choose how to apply your variable changes</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4 px-0'>
							<VariableActionItem
								icon={<FileDown className='h-5 w-5' />}
								title='Save for Export'
								description='Variables will be applied when exporting the project. Source files remain unchanged.'
								buttonText='Save for Export'
								onClick={handleSaveForExport}
								disabled={!isValid || isSubmitting}
							/>
							<VariableActionItem
								icon={<Pencil className='h-5 w-5' />}
								title='Apply to Source Files'
								description='Permanently modify source files by replacing variables with their values. This action cannot be undone.'
								buttonText='Apply Permanently'
								buttonVariant='destructive'
								onClick={handleApplyPermanently}
								disabled={!isValid || isSubmitting}
							/>
						</CardContent>
					</Card>
				)}
			</form>
		</Form>
	);
}
