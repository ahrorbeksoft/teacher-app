"use client";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useSidebar } from "./ui/sidebar";

export default function PageContainer({
	children,
	className,
	container = true,
	scrollable = true,
	header,
}: {
	children: React.ReactNode;
	className?: string;
	header?: React.ReactNode;
	container?: boolean;
	scrollable?: boolean;
}) {
	const { isMobile, open: sidebarOpen } = useSidebar();

	const new_children = container ? <div className="p-4 @container">{children}</div> : children;

	return (
		<div className={cn("size-full", className)}>
			{header && <div className="flex h-12 items-center justify-between gap-2 border-b px-2">{header}</div>}
			{scrollable ? (
				<ScrollArea
					className={cn(
						header ? "h-[calc(100vh-105px)]" : "h-[calc(100vh-56px)]",
						isMobile ? "w-screen" : !sidebarOpen ? "w-[calc(100vw-3rem)]" : "w-[calc(100vw-16rem)]",
					)}
				>
					{new_children}
					<ScrollBar orientation="horizontal" />
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			) : (
				new_children
			)}
		</div>
	);
}
