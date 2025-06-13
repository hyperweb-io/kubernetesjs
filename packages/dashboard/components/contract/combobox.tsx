import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface ComboboxOption {
	value: string;
	label: string;
	metadata?: Record<string, any>;
}

interface ComboboxProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	options?: ComboboxOption[];
	className?: string;
	disabled?: boolean;
	displayMode?: 'value' | 'label';
	renderOption?: (option: ComboboxOption) => React.ReactNode;
	optionsHeader?: React.ReactNode;
	onOpenChange?: (isOpen: boolean) => void;
}

export const Combobox = ({
	value = '',
	onChange,
	className,
	options = [],
	placeholder = '',
	disabled = false,
	displayMode = 'value',
	renderOption,
	optionsHeader,
	onOpenChange,
}: ComboboxProps) => {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [userTyping, setUserTyping] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Find the corresponding display value when value changes
	useEffect(() => {
		if (value) {
			const selectedOption = options.find((option) => option.value === value);
			if (selectedOption) {
				setInputValue(displayMode === 'label' ? selectedOption.label : selectedOption.value);
				return;
			}
		}
		setInputValue(value);
	}, [value, options, displayMode]);

	const filteredOptions = useMemo(
		() => options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())),
		[options, inputValue],
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				if (open) {
					setOpen(false);
					onOpenChange?.(false);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [onOpenChange, open]);

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			if (isOpen && filteredOptions.length === 0) return;

			setOpen(isOpen);
			onOpenChange?.(isOpen);
			if (isOpen) {
				inputRef.current?.focus();
			}
		},
		[filteredOptions.length, onOpenChange],
	);

	useEffect(() => {
		if (filteredOptions.length === 0) {
			handleOpenChange(false);
		} else if (userTyping) {
			handleOpenChange(true);
		}
		setUserTyping(false);
		setHighlightedIndex(-1);
	}, [filteredOptions.length, handleOpenChange, inputValue, userTyping]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setUserTyping(true);
		onChange?.(e.target.value);
	};

	const handleSelect = (option: ComboboxOption) => {
		setInputValue(displayMode === 'label' ? option.label : option.value);
		onChange?.(option.value);
		setOpen(false);
		onOpenChange?.(false);
		setHighlightedIndex(-1);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!open) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex !== -1) {
					handleSelect(filteredOptions[highlightedIndex]);
				} else {
					setOpen(false);
					onOpenChange?.(false);
				}
				break;
			case 'Escape':
				e.preventDefault();
				setOpen(false);
				onOpenChange?.(false);
				break;
		}
	};

	const handleClearValue = (e: React.MouseEvent) => {
		e.stopPropagation();
		setInputValue('');
		onChange?.('');
		inputRef.current?.focus();
		setOpen(true);
		onOpenChange?.(true);
	};

	return (
		<div ref={containerRef} className={cn('relative w-full', className)}>
			<div className='relative w-full'>
				<Input
					ref={inputRef}
					role='combobox'
					aria-expanded={open}
					aria-controls='options-list'
					aria-activedescendant={
						highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex].value}` : undefined
					}
					placeholder={placeholder}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (!disabled && filteredOptions.length > 0) {
							setOpen(true);
							onOpenChange?.(true);
						}
					}}
					className='pr-16'
					disabled={disabled}
				/>
				{inputValue && !disabled && (
					<X
						className='absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-50
              hover:opacity-100'
						onClick={handleClearValue}
						aria-label='Clear value'
					/>
				)}
				<ChevronDown
					className={cn('absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2', disabled ? 'opacity-30' : 'opacity-50')}
				/>
			</div>
			{open && filteredOptions.length > 0 && (
				<div
					id='options-list'
					role='listbox'
					className={cn(
						`scrollbar-neutral absolute z-50 mt-2 max-h-[190px] w-full overflow-y-auto rounded-md
            border bg-popover p-1 shadow-md`,
						'origin-top transition-all duration-100',
						open ? 'animate-in fade-in-0 zoom-in-95' : 'pointer-events-none animate-out fade-out-0 zoom-out-95',
					)}
				>
					{optionsHeader}
					{filteredOptions.map((option, index) => (
						<div
							key={option.value}
							id={`option-${option.value}`}
							role='option'
							aria-selected={index === highlightedIndex}
							className={`flex h-9 cursor-pointer items-center rounded-sm px-4 text-sm font-normal text-body-text
              ${index === highlightedIndex ? 'bg-muted' : 'hover:bg-muted'}`}
							onClick={() => handleSelect(option)}
						>
							{renderOption ? renderOption(option) : option.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
