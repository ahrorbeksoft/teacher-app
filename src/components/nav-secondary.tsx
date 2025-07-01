import * as React from "react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/types";
import { Link, useLocation } from "@tanstack/react-router";

export function NavSecondary({
	items,
	...props
}: {
	items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const location = useLocation();
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={location.pathname.startsWith(item.url)}>
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
