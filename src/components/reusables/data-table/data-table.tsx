"use client";
"use no memo";

import { Button } from "@/components/extendui/button";
import { Input } from "@/components/extendui/input";
import { type Params, useConfirm } from "@/components/ui/alert-dialog-provider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	type CellContext,
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { HeaderContext, Row } from "@tanstack/react-table";
import { ChevronsUpDown, Search, Settings2 } from "lucide-react";
import { ArrowUpDown, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";

export const AlignContent = ({
	align,
	children,
}: { align?: "left" | "center" | "right"; children?: React.ReactNode }) => {
	return (
		<div
			className={cn(
				"flex",
				align && align === "left" && "justify-start",
				align && align === "center" && "justify-center",
				align && align === "right" && "justify-end",
			)}
		>
			{children}
		</div>
	);
};

type OptionColumn<TData, TValue> =
	| {
			// as accessorKey
			id: keyof TData;
			accessorFn?: undefined;
			header: string;
			cell?: (info: CellContext<TData, TValue>) => React.ReactNode;
			enableSorting?: boolean;
			enableHiding?: boolean;
			align?: "left" | "center" | "right";
	  }
	| {
			id: string;
			accessorFn: (row: TData) => TValue;
			header: string;
			cell?: (info: CellContext<TData, TValue>) => React.ReactNode;
			enableSorting?: boolean;
			enableHiding?: boolean;
			align?: "left" | "center" | "right";
	  };

export type DataTableOptions<TData, TValue> = {
	tableName: string;
	search?:
		| {
				type: "single";
				placeholder: string;
				column: keyof TData | string;
		  }
		| {
				type: "global";
				placeholder: string;
				columns: (keyof TData | string)[];
		  };
	rowAction?: (cellContext: CellContext<TData, TValue>) => React.ReactNode;
	bulkActions?: {
		label: React.ReactNode;
		className?: string;
		confirm?: Params<"confirm">;
		onClick: (rows: Row<TData>[]) => Promise<void>;
	}[];
	columns: OptionColumn<TData, TValue>[];
	hiddenColumns?: (keyof TData)[];
	facetedFilters?: {
		column: keyof TData;
		title: string;
		searchText?: string;
		options?: {
			label: string;
			value: string;
			icon?: React.ElementType;
		}[];
	}[];
	Buttons?: React.ReactNode;
};

interface DataTableProps<TData, TValue> {
	options: DataTableOptions<TData, TValue>;
	data: TData[];
	scrollableClassName?: string;
}

export function SortableHeader<TData, TValue>(
	headerContext: HeaderContext<TData, TValue>,
	text: string,
	align?: "left" | "center" | "right",
) {
	return (
		<AlignContent align={align}>
			<Button
				size={"sm"}
				variant="ghost"
				className="flex items-center p-1 text-sm gap-2"
				onClick={() => headerContext.column.toggleSorting(headerContext.column.getIsSorted() === "asc")}
			>
				{text}
				<ArrowUpDown className="h-4 w-4" />
			</Button>
		</AlignContent>
	);
}

export const globalFilterFn = (row: any, columnId: any, filterValue: any) => {
	// if the filterValue is a string, split it into words
	if (typeof filterValue === "string") {
		const terms = filterValue.toLowerCase().split(" ");
		return terms.every((term: string) =>
			row.getAllCells().some((cell: any) => {
				const column = cell.column.columnDef;
				if (column.enableGlobalFilter === false) return false; // Skip excluded columns
				// biome-ignore lint/style/useConst: <explanation>
				let cellValue = cell.getValue();
				if (typeof cellValue === "string") {
					return String(cellValue).toLowerCase().includes(term);
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else if (cellValue) {
					return cellValue.includes?.(term);
				}
				return false;
			}),
		);
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		return row.getAllCells().some((cell: any) => cell.getValue().includes(filterValue));
	}
};

export const localFilter = (row: any, columnId: any, filterValue: any) => {
	// If there's no filter value, return all rows
	if (!filterValue) {
		return true;
	}

	const rowValue = row.getValue(columnId);

	// Handle filterValue as array (multiple filters selected)
	if (Array.isArray(filterValue)) {
		// If empty array, return all rows
		if (filterValue.length === 0) {
			return true;
		}

		// If rowValue is an array (student in multiple groups)
		if (Array.isArray(rowValue)) {
			// Return true only if ALL values in filterValue are included in rowValue
			return filterValue.every((filter) => rowValue.includes(filter));
		}

		// If rowValue is a single value, check if it's in filterValue
		return filterValue.includes(rowValue);
	}

	// Handle filterValue as single value
	if (Array.isArray(rowValue)) {
		// Return true if rowValue includes the filterValue
		return rowValue.includes(filterValue);
	}

	// Both are single values, do direct comparison
	return rowValue === filterValue;
};

export function DataTable<TData, TValue>({
	options,
	data,
	scrollableClassName = "h-[calc(100vh-178px)]",
}: DataTableProps<TData, TValue>) {
	const t = useTranslations();
	const confirm = useConfirm();

	const columns: ColumnDef<TData, TValue>[] = [];

	// if selectable add selection column
	if (options.bulkActions) {
		columns.push({
			id: "select",
			header: ({ table }) => (
				<div className="flex">
					<Checkbox
						className="mx-4"
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex">
					<Checkbox
						checked={row.getIsSelected()}
						className="mx-4"
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		});
	}

	// add columns
	// biome-ignore lint/complexity/noForEach: <explanation>
	options.columns.forEach((column) => {
		// if the column has a accessor function
		const c_header = column.enableSorting
			? (headerContext: HeaderContext<TData, TValue>) => SortableHeader(headerContext, column.header, column.align)
			: () => <AlignContent align={column.align}>{column.header}</AlignContent>;
		const c_cell = (props: CellContext<TData, TValue>) => {
			const cellContent = column.cell ? (
				column.cell(props)
			) : props.getValue() ? (
				props.getValue()
			) : (
				<Badge className="font-semibold text-white text-xs bg-gray-500">{t("n-a")}</Badge>
			);
			return <AlignContent align={column.align}>{cellContent as ReactNode}</AlignContent>;
		};
		const c_filter = options.search?.type === "global" ? options.search.columns.includes(column.id) : false;
		const c_filterFn = options.facetedFilters?.some((f) => f.column === column.id) ? localFilter : "includesString";

		if (column.accessorFn) {
			columns.push({
				id: column.id,
				accessorFn: column.accessorFn,
				header: c_header,
				cell: c_cell,
				enableSorting: column.enableSorting,
				enableHiding: column.enableHiding,
				enableGlobalFilter: c_filter,
				filterFn: c_filterFn,
			});
			// if not
		} else {
			columns.push({
				accessorKey: column.id,
				header: c_header,
				cell: c_cell,
				enableSorting: column.enableSorting,
				enableHiding: column.enableHiding,
				enableGlobalFilter: c_filter,
				filterFn: c_filterFn,
			});
		}
	});

	// add row action if exists
	if (options.rowAction) {
		columns.push({
			id: "actions",
			header: ({ table }) => {
				return (
					<div className="flex items-center justify-center mx-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<Settings2 className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[150px]">
								<DropdownMenuLabel>{t("toggle-columns")}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{table
									.getAllColumns()
									.filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{options.columns.find((c) => c.id === column.id)?.header}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
			cell: (cellContext) => (
				<div className="flex items-center justify-center mx-4">{options.rowAction?.(cellContext)}</div>
			),
			enableSorting: false,
			enableHiding: false,
		});
	}

	const [globalFilter, setGlobalFilter] = useState<any>();

	const table = useReactTable({
		data,
		globalFilterFn,
		columns: columns,
		enableRowSelection: true,
		initialState: {
			pagination: {
				pageSize: 50,
			},
			columnVisibility: options.hiddenColumns
				? Object.fromEntries(options.hiddenColumns.map((key) => [key, false]))
				: {},
		},

		state: {
			globalFilter,
		},
		// onColumnFiltersChange: setColumnFilters,
		// onColumnVisibilityChange: setColumnVisibility,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: (table, columnId) => {
			// This function returns another function that will compute the unique values
			return () => {
				const uniqueValueMap = new Map<any, number>();

				// Iterate through all rows in the table
				// biome-ignore lint/complexity/noForEach: <explanation>
				table.getFilteredRowModel().rows.forEach((row) => {
					// Get the value from the specific column
					const value = row.getValue(columnId);

					// Handle the case where a student belongs to multiple groups
					if (Array.isArray(value)) {
						// If value is an array, count each group separately
						// biome-ignore lint/complexity/noForEach: <explanation>
						value.forEach((groupValue) => {
							uniqueValueMap.set(groupValue, (uniqueValueMap.get(groupValue) || 0) + 1);
						});
					} else if (value != null) {
						// Handle single value case (not null or undefined)
						uniqueValueMap.set(value, (uniqueValueMap.get(value) || 0) + 1);
					}
				});

				return uniqueValueMap;
			};
		},
	});

	const isFiltered = table.getState().columnFilters.length > 0;

	const { isMobile, open: sidebarOpen } = useSidebar();

	const [showSearch, setShowSearch] = useState<boolean>(true);

	useEffect(() => {
		if (!isMobile) setShowSearch(false);
	}, [isMobile]);

	return (
		<>
			<div className="flex h-12 items-center justify-between gap-2 border-b px-2">
				{options.search && isMobile && showSearch && (
					<div className="w-full h-9 flex items-center pl-1 justify-between">
						<div className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							<input
								key="search_items"
								className={cn(
									"flex h-9 w-full rounded-md bg-transparent text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
								)}
								placeholder={options.search.placeholder}
								value={
									options.search.type === "single"
										? ((table.getColumn(options.search.column as string)?.getFilterValue() as string) ?? "")
										: globalFilter
								}
								onChange={(event) => {
									if (options.search?.type === "single") {
										table.getColumn(options.search.column as string)?.setFilterValue(event.target.value);
									}
									if (options.search?.type === "global") {
										setGlobalFilter(event.target.value);
									}
								}}
							/>
						</div>
						<Button size="sm" variant="ghost" onClick={() => setShowSearch(false)}>
							<X className="h-6 w-6" />
						</Button>
					</div>
				)}
				{!showSearch && (
					<div className="flex w-full items-center gap-3">
						{options.facetedFilters?.map((facet) => {
							const column = table.getColumn(facet.column as string);
							if (!column) return null;
							return (
								<DataTableFacetedFilter
									key={`filter-${String(facet.column)}`}
									column={column}
									title={facet.title}
									searchText={facet.searchText}
									options={facet.options}
								/>
							);
						})}
						{isFiltered && (
							<Button variant="ghost" onClick={() => table.resetColumnFilters()} className="border-dashed px-2">
								<div className="hidden md:mr-2 md:block">{t("reset")}</div>
								<X />
							</Button>
						)}
					</div>
				)}
				{options.search && !isMobile && (
					<div className="block items-center">
						<Input
							key="search_items"
							placeholder={options.search.placeholder}
							value={
								options.search.type === "single"
									? ((table.getColumn(options.search.column as string)?.getFilterValue() as string) ?? "")
									: globalFilter
							}
							onChange={(event) => {
								if (options.search?.type === "single") {
									table
										// @ts-ignore
										.getColumn(options.search.column as string)
										?.setFilterValue(event.target.value);
								}
								if (options.search?.type === "global") {
									setGlobalFilter(event.target.value);
								}
							}}
							className="w-96"
						/>
					</div>
				)}
				{isMobile && !showSearch && (
					<Button variant="outline" onClick={() => setShowSearch(true)}>
						<Search className="w-4 h-4" />
					</Button>
				)}
				{options.Buttons}
			</div>

			<div className="relative flex flex-col overflow-hidden">
				<ScrollArea
					className={cn(
						scrollableClassName,
						"relative",
						isMobile ? "w-screen" : !sidebarOpen ? "w-[calc(100vw-3rem)]" : "w-[calc(100vw-16rem)]",
					)}
				>
					<Table>
						<TableHeader className="sticky top-0 z-50 bg-background h-12 shadow-border shadow-sm">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												className="relative text-start align-middle flex-nowrap text-nowrap font-medium text-muted-foreground"
											>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="relative">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted #cursor-pointer"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="h-auto p-2 align-middle flex-nowrap text-nowrap">
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={table.getVisibleFlatColumns().length}
										className={cn("h-[calc(100vh-210px)] text-center text-xl w-full")}
									>
										{t("no-results")}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					<ScrollBar orientation="vertical" />
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
				{options.bulkActions &&
					options.bulkActions.length > 0 &&
					table.getFilteredSelectedRowModel().rows.length > 0 && (
						<div className="absolute inset-x-0 bottom-20 z-50 mx-auto flex h-[60px] max-w-xl animate-fadeIn items-center justify-between rounded-md border bg-background px-6 py-3 shadow">
							<p className="text-sm font-semibold">
								{t("items-selected", { count: table.getFilteredSelectedRowModel().rows.length })}
							</p>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<span className="sr-only">Open menu</span>
										{t("bulk-actions")}
										<ChevronsUpDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="top" align="center">
									<DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
									{options.bulkActions.map((action, index) => (
										<DropdownMenuItem
											key={index}
											className={cn(action.className)}
											onClick={async () => {
												if (action.confirm) {
													const confirmed = await confirm(action.confirm);
													if (confirmed) {
														action.onClick(table.getFilteredSelectedRowModel().rows);
													}
												} else {
													action.onClick(table.getFilteredSelectedRowModel().rows);
												}
												table.toggleAllPageRowsSelected(false);
											}}
										>
											{action.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				<div className="sticky inset-x-0 bottom-0 z-20 border-t bg-background">
					<DataTablePagination table={table} />
				</div>
			</div>
		</>
	);
}
