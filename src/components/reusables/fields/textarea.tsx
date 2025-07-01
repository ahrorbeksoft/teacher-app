import * as React from "react";

import { SelectHelperText } from "@/components/extendui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFieldContext } from "../form";

export default function Textarea({
	className,
	label,
	required,
	...props
}: React.ComponentProps<"textarea"> & { label?: string }) {
	const field = useFieldContext<string>();
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";

	return (
		<div className="flex flex-col space-y-2 w-full">
			{label && (
				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			)}
			<textarea
				data-slot="textarea"
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				className={cn(
					"border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					error && "border-red-500 text-red-500",
					className,
				)}
				{...props}
			/>
			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
