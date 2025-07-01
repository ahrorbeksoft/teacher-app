"use client";

import { type Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import React from "react";

import { Button } from "@/components/extendui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/extendui/command";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslations } from "use-intl";
type Option = {
	label: string;
	value: string;
	icon?: React.ElementType;
};
interface DataTableFacetedFilterProps<TData, TValue> {
	column: Column<TData, TValue>;
	title?: string;
	searchText?: string;
	options?: Option[];
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title = "Filters",
	searchText = "Search filters",
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const t = useTranslations();
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	const optionsToRender: (Option & { count: number })[] = options
		? options.map((o) => ({
				...o,
				count: facets.get(o.value) || 0,
			}))
		: Array.from(facets, ([value, count]) => ({
				value,
				label: value || t("n-a"),
				count,
			}));

	const handleSelect = (option: string, isSelected: boolean) => {
		const updatedValues = new Set(selectedValues);
		if (isSelected) {
			updatedValues.delete(option);
		} else {
			updatedValues.add(option);
		}
		column?.setFilterValue(updatedValues.size ? Array.from(updatedValues) : undefined);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className=" border-dashed">
					<PlusCircle />
					<span className="hidden md:block">{title}</span>
					{selectedValues.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							{/* lg:hidden */}
							<Badge variant="secondary" className="rounded-sm px-1 font-normal">
								{selectedValues.size}
							</Badge>
							{/* <div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge variant="secondary" className="rounded-sm px-1 font-normal">
										{t("items-selected", { count: selectedValues.size })}
									</Badge>
								) : (
									optionsToRender
										.filter((option) => selectedValues.has(option.value))
										.map((option, index) => (
											<Badge variant="secondary" key={index} className="rounded-sm px-1 font-normal">
												{option.label}
											</Badge>
										))
								)}
							</div> */}
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={searchText} />
					<CommandList>
						<CommandEmpty>{t("no-results")}</CommandEmpty>
						<CommandGroup>
							{optionsToRender.map((option, index: number) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem key={index} onSelect={() => handleSelect(option.value, isSelected)}>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
											)}
										>
											<Check />
										</div>
										<span>{option.label}</span>
										{option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
										<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
											{option.count}
										</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center"
									>
										{t("clear-filters")}
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
