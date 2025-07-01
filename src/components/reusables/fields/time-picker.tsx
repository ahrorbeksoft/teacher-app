"use client";

import { SelectHelperText } from "@/components/extendui/select";
import { TimePickerInput } from "@/components/time-picker-input";
import { Label } from "@/components/ui/label";
import { cn, getDateFromTime, getTimeFromDate } from "@/lib/utils";
import * as React from "react";
import { useFieldContext } from "../form";

export default function TimePicker({
	label,
	required,
	className,
}: { required?: boolean; label?: string; className?: string }) {
	const minuteRef = React.useRef<HTMLInputElement>(null);
	const hourRef = React.useRef<HTMLInputElement>(null);

	const field = useFieldContext<string | undefined>();
	const value = field.state.value;
	const error = field.state.meta.errors.length > 0;
	const errorText = error ? field.state.meta.errors[0].message : "";

	return (
		<div className="flex flex-col space-y-2 px-0.5">
			{label && (
				<Label
					className={cn(error && "text-red-500", required && "after:content-['*'] after:text-red-500 after:-ml-2")}
				>
					{label}
				</Label>
			)}
			<div className="flex items-center gap-2">
				<div className="grid gap-1 text-center">
					<TimePickerInput
						className={cn(error && "border-red-500 text-red-500", className)}
						picker="hours"
						date={getDateFromTime(value)}
						setDate={(date) => field.handleChange(getTimeFromDate(date))}
						ref={hourRef}
						onRightFocus={() => minuteRef.current?.focus()}
					/>
				</div>
				<span className={cn("font-bold", error && "text-red-500")}>:</span>
				<div className="grid gap-1 text-center">
					<TimePickerInput
						className={cn(error && "border-red-500 text-red-500", className)}
						picker="minutes"
						date={getDateFromTime(value)}
						setDate={(date) => field.handleChange(getTimeFromDate(date))}
						ref={minuteRef}
						onLeftFocus={() => hourRef.current?.focus()}
					/>
				</div>
			</div>
			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
