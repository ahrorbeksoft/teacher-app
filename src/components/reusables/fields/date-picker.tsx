"use client";
"use no memo";

import { Button } from "@/components/extendui/button";
import { SelectHelperText } from "@/components/extendui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DayPicker } from "react-day-picker";
import { useFieldContext } from "../form";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

export default function DatePicker({
	className,
	formatter = (date: Date) => format(date, "LLLL dd, y"),
	placeholder = "Pick a date",
	label,
	required = false,
	disabled = false,
	hidden,
}: {
	className?: string;
	placeholder?: string;
	label?: string;
	formatter?: (date: Date) => string;
	required?: boolean;
	disabled?: boolean;
	hidden?: CalendarProps["hidden"];
}) {
	const [open, setOpen] = useState(false);
	const field = useFieldContext<Date | undefined>();
	const value = field.state.value;
	const [month, setMonth] = useState<Date | undefined>(value);
	const [date, setDate] = useState<Date | undefined>(value);
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
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						disabled={disabled}
						id="date"
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!value && "text-muted-foreground",
							error && "border-red-500 text-red-500",
							className,
						)}
					>
						<CalendarIcon className="w-4 h-4" />
						{value ? formatter(value) : <span>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selectableMonths={true}
						selected={date}
						onSelect={(date) => {
							field.handleChange(date);
							setDate(date);
							setOpen(false);
						}}
						hidden={hidden}
						month={month}
						onMonthChange={setMonth}
					/>
				</PopoverContent>
			</Popover>
			{error && <SelectHelperText error={true}>{errorText}</SelectHelperText>}
		</div>
	);
}
