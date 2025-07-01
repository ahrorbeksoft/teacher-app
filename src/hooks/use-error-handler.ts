import { toast } from "sonner";
import { useTranslations } from "use-intl";

export default function useInstantErrorHandler() {
	const t = useTranslations();
	function handler(err: unknown) {
		console.log(err);
		// @ts-ignore
		if (err?.message.startsWith("Permission denied") || err?.message.startsWith("Could not evaluate")) {
			toast.error(t("permission-denied"));
		} else {
			toast.error(t("unknown-error"));
		}
	}
	return handler;
}
