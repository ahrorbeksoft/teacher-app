"use client";

import { Button } from "@/components/extendui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/extendui/command";
import { SelectHelperText } from "@/components/extendui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Dot } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { useFieldContext } from "../form";

type Option = {
	value: string;
	label: ReactNode;
	render?: React.ReactNode;
	color?: string;
	disabled?: boolean;
};

type SearchableSelectProps = {
	options: Option[];
	placeholder?: string;
	searchText?: string;
	notFoundText?: string;
	label?: string;
	className?: string;
	required?: boolean;
	onSelect?: (value: string) => void;
	disabled?: boolean;
};

export default function SearchableSelect({
	options,
	label,
	placeholder = "Select option",
	searchText = "Search options...",
	notFoundText = "No options found",
	className,
	required = false,
	onSelect,
	disabled = false,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const field = useFieldContext<string>();
	const value = field.state.value;
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";
	const buttonRef = useRef<HTMLButtonElement>(null);

	const findElement = (value: string) => {
		const option = options.find((option) => option.value === value);
		return (
			<div className="flex items-center gap-2">
				{option?.color && <Dot className={option?.color} width={10} height={10} strokeWidth={20} />}
				{option?.label}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={buttonRef}
						variant="outline"
						aria-expanded={open}
						disabled={disabled}
						className={cn("w-full justify-between px-3 font-normal", error && "border-red-500 text-red-500", className)}
					>
						<span className={cn("truncate", !value && "text-muted-foreground")}>
							{value ? findElement(value) : <>{placeholder}</>}
						</span>
						<ChevronDown size={16} strokeWidth={2} className="text-muted-foreground/80" aria-hidden="true" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" style={{ width: buttonRef.current?.clientWidth }} className={cn("p-0")}>
					<Command

					// value={options.find((o) => o.value === value)?.label}
					>
						<CommandInput placeholder={searchText} />
						<CommandList>
							<CommandEmpty>{notFoundText}</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										disabled={option.disabled}
										// value={option.label}
										onSelect={() => {
											setOpen(false);
											field.handleChange(option.value);
											onSelect?.(option.value);
										}}
									>
										{option.render ? (
											option.render
										) : (
											<div className="flex items-center gap-2">
												{option.color && <Dot className={option.color} strokeWidth={12} />}
												{option.label}
											</div>
										)}
										<Check className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
