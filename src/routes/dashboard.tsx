import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/extendui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { profileStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () => {
		if (!profileStore.state) {
			throw Error("Access denied");
		}
	},
	loader: ({ context }) => {
		return {
			crumb: context.t("dashboard"),
		};
	},
	component: DashboardLayout,
});

function DashboardLayout() {
	const t = useTranslations();
	const sidebarOpen = JSON.parse(Cookies.get("sidebar_state") || "true");
	const status = db.useConnectionStatus();
	const connectionState =
		status === "connecting" || status === "opened"
			? "connecting"
			: status === "authenticated"
				? "connected"
				: status === "closed"
					? "closed"
					: status === "errored"
						? "errored"
						: "unexpected state";

	return (
		<SidebarProvider defaultOpen={sidebarOpen} className="h-screen">
			<AppSidebar variant="inset" />
			<SidebarInset className="overflow-hidden">
				<header className="sticky top-0 bg-background rounded-xl">
					<div className="relative flex h-14 flex-row items-center justify-between border-b px-6">
						<div className="flex items-center gap-3">
							<SidebarTrigger className="-ml-1" />
							<Breadcrumbs />
						</div>
						<div className="flex items-center gap-3">
							<ThemeToggle />
							<LanguageSwitcher />
							<Badge
								variant="outline"
								className={cn(
									"h-9 px-4 font-mono font-bold",
									connectionState === "connected" && "text-emerald-500 border-emerald-500",
									connectionState === "errored" && "text-red-500 border-red-500",
									connectionState === "connecting" && "text-orange-500 border-orange-500",
									connectionState === "unexpected state" ||
										(connectionState === "closed" && "text-muted-foreground border-muted-foreground"),
								)}
							>
								{t("connection-status", { status: connectionState })}
							</Badge>
						</div>
					</div>
				</header>
				<main className="flex flex-col">
					<Outlet />
				</main>
				{/* <Outlet /> */}
			</SidebarInset>
		</SidebarProvider>
	);
}
