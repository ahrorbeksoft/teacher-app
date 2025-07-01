import * as React from "react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/types";
import { DashboardIcon, GearIcon } from "@radix-ui/react-icons";
import { useTranslations } from "use-intl";
import ExpensesIcon from "./icons/expenses-icon";
import GroupsIcon from "./icons/groups-icon";
import PaymentsIcon from "./icons/payments-icon";
import StudentsIcon from "./icons/students-icon";
import SubjectsIcon from "./icons/subjects-icon";
import TeacherIcon from "./icons/teacher-icon";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const t = useTranslations();

	const navMain: NavItem[] = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: DashboardIcon,
		},
		{
			title: "Students",
			url: "/dashboard/students",
			icon: StudentsIcon,
		},
		{
			title: "Groups",
			url: "/dashboard/groups",
			icon: GroupsIcon,
		},
		{
			title: "Expenses",
			url: "/dashboard/expenses",
			icon: ExpensesIcon,
		},
		{
			title: "Payments",
			url: "/dashboard/payments",
			icon: PaymentsIcon,
		},
		{
			title: "Courses",
			url: "/dashboard/courses",
			icon: SubjectsIcon,
		},
	];

	const navSecondary: NavItem[] = [
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: GearIcon,
		},
	];

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
							<TeacherIcon className="!size-5" />
							<span className="text-base font-semibold">Teacher App</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				{/* <NavDocuments items={data.documents} /> */}
				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
