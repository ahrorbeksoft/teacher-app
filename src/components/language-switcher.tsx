import { Button } from "@/components/extendui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/constants";
import { languageStore } from "@/lib/stores";
import { setLanguage } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslations } from "use-intl";

export const LanguageSwitcher = () => {
	const t = useTranslations();
	const router = useRouter();
	const currentLocale = useStore(languageStore, (state) => state.currentLocale);

	const CurrentLanguageIcon = languages.find((l) => l.code === currentLocale)?.icon;

	if (!CurrentLanguageIcon) return null;

	const handleLanguageChange = (lang: string) => {
		setLanguage(lang as any);
		router.invalidate(); // This will update the cookie and the store state
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<span className="hidden md:block">
						<span className="flex items-center">
							<CurrentLanguageIcon className="mr-2 h-5 w-5" />
							{t("current-language")}
						</span>
					</span>
					<span className="-mr-2 block md:hidden">
						<CurrentLanguageIcon className="mr-2 h-5 w-5" />
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40">
				<DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLanguageChange}>
					{languages.map((lang) => (
						<DropdownMenuRadioItem key={lang.code} className="flex cursor-pointer" value={lang.code}>
							<lang.icon className="h-5 w-5 mr-2" />
							{lang.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
