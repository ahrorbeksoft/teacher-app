import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/types";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link, useLocation } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";

export function NavMain({
	items,
}: {
	items: NavItem[];
}) {
	const location = useLocation();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu className="mb-6">
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
						>
							<PlusIcon />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
							<MailIcon />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								asChild
								isActive={
									item.url.replaceAll("/", "") === "dashboard"
										? location.pathname.replaceAll("/", "") === item.url.replaceAll("/", "")
										: location.pathname.startsWith(item.url)
								}
							>
								<Link to={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
