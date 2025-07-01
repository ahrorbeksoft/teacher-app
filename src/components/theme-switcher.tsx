"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/extendui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "use-intl";
import { useTheme } from "./theme-provider";

export default function ThemeSwitcher() {
	const { setTheme } = useTheme();
	const t = useTranslations();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">{t("toggle-theme")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>{t("theme", { theme: "light" })}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>{t("theme", { theme: "dark" })}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>{t("theme", { theme: "system" })}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
