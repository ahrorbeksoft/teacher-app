"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectHelperText,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/extendui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useFieldContext } from "../form";

export default function SelectField({
	placeholder = "Select something",
	label,
	className,
	selectLabel,
	options,
	icon: Icon,
	required = false,
}: {
	icon?: React.ElementType;
	label?: string;
	selectLabel?: string;
	options?: {
		label: string;
		value: string;
		icon?: React.ElementType;
	}[];
	placeholder?: string;
	className?: string;
	required?: boolean;
}) {
	const field = useFieldContext<string>();
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			)}
			<Select
				disabled={!options}
				value={field.state.value}
				onValueChange={(value) => {
					field.handleChange(value);
				}}
			>
				<SelectTrigger
					error={error}
					icon={Icon ? <Icon className="w-4 h-4 mr-2" /> : null}
					openIcon={
						<ChevronDownIcon size={16} strokeWidth={2} className="text-muted-foreground/80" aria-hidden="true" />
					}
					className={cn(field.state.value ? "text-foreground" : "text-muted-foreground", "w-full", className)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
						{options?.map((option, index) => {
							return (
								<SelectItem key={index} value={option.value}>
									<div className="flex items-center gap-2">
										{option.icon && <option.icon className="w-4 h-4" />} <span>{option.label}</span>
									</div>
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
