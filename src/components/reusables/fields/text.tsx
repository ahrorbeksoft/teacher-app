"use client";

import { Input } from "@/components/extendui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { unformat as unmask, useMask } from "@react-input/mask";
import { type NumberFormatOptions, format, unformat, useNumberFormat } from "@react-input/number-format";
import { useFieldContext } from "../form";

export default function TextField({
	label,
	extra,
	required,
	...props
}: React.ComponentProps<typeof Input> & { label?: string; extra?: "phone" | "currency" | "percentage" }) {
	const field = useFieldContext<string | number>();
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";

	const phoneInput = useMask({
		mask: "+998 (__) ___-__-__",
		replacement: { _: /\d/ },
	});

	const formatOptions: NumberFormatOptions & {
		locales?: Intl.LocalesArgument;
	} = {
		locales: "uz",
		currency: "UZS",
		format: "currency",
		maximumFractionDigits: 0,
	};

	const currencyInput = useNumberFormat(formatOptions);

	return (
		<div className="flex flex-col space-y-2 w-full px-0.5">
			{label && (
				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			)}
			<Input
				ref={extra === "phone" ? phoneInput : extra === "currency" ? currencyInput : undefined}
				error={error}
				onBlur={field.handleBlur}
				textError={errorText}
				value={
					extra === "currency"
						? format(field.state.value ?? 0, formatOptions)
						: extra === "percentage"
							? format(field.state.value ?? 0, { format: "percent", maximumFractionDigits: 0 })
							: field.state.value
				}
				onChange={(e) => {
					const value = e?.target?.value;
					if (extra === "currency") {
						field.handleChange(Number.parseInt(unformat(value, "uz")));
					} else if (extra === "percentage") {
						field.handleChange(Number.parseInt(unformat(value)));
					} else {
						field.handleChange(value);
					}
				}}
				placeholder={extra === "phone" ? "+998 (__) ___-__-__" : ""}
				{...props}
			/>
		</div>
	);
}
