import { SelectHelperText } from "@/components/extendui/select";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../form";

export default function Checkbox({
	className,
	label,
	required,
	disabled,
	onCheckedChange,
}: {
	label: string;
	className?: string;
	required?: boolean;
	disabled?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}) {
	const field = useFieldContext<boolean>();
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";

	return (
		<div className="flex flex-col space-y-2 w-full">
			<div className="flex items-center gap-2">
				<CheckboxPrimitive.Root
					data-slot="checkbox"
					disabled={disabled}
					checked={field.state.value}
					onCheckedChange={(value) => {
						const newValue = value === "indeterminate" ? false : value;
						field.handleChange(newValue);
						onCheckedChange?.(newValue);
					}}
					className={cn(
						"peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
				>
					<CheckboxPrimitive.Indicator
						data-slot="checkbox-indicator"
						className="flex items-center justify-center text-current transition-none"
					>
						<CheckIcon className="size-3.5" />
					</CheckboxPrimitive.Indicator>
				</CheckboxPrimitive.Root>

				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			</div>

			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
