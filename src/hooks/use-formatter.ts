"use client";
import { differenceInMinutes, format, isThisWeek, isThisYear, isToday, isYesterday } from "date-fns";
import { useFormatter, useNow, useTranslations } from "use-intl";

export default function useFormat() {
	const formatter = useFormatter();
	const t = useTranslations();
	const now = useNow();

	function handler(
		date?: Date | number | string,
		type: "default" | "custom" | "birthday" | "month" = "default",
		withTime = false,
	): string | null {
		if (!date) return null;
		if (!(date instanceof Date)) date = new Date(date);

		if (type === "custom") {
			const diffMinutes = differenceInMinutes(now, date);
			if (diffMinutes < 1) return t("just-now");
			if (diffMinutes < 60) return t("minutes-ago", { minutes: diffMinutes });
			if (isToday(date)) return t("today-at", { time: format(date, "HH:mm") });
			if (isYesterday(date)) return t("yesterday-at", { time: format(date, "HH:mm") });
			if (isThisWeek(date)) return formatter.dateTime(date, { weekday: "long", hour: "numeric", minute: "numeric" });
			if (isThisYear(date))
				return formatter.dateTime(date, {
					month: "long",
					day: "numeric",
					...(withTime ? { hour: "numeric", minute: "numeric" } : {}),
				});
			return formatter.dateTime(date, {
				year: "numeric",
				month: "long",
				day: "numeric",
				...(withTime ? { hour: "numeric", minute: "numeric" } : {}),
			});

			// should return like "today, at 12:30"
		}

		if (type === "month") {
			if (isThisYear(date)) {
				return formatter.dateTime(date, { month: "long" });
			}
			return formatter.dateTime(date, { month: "long", year: "numeric" });
		}

		if (type === "birthday") {
			return formatter.dateTime(date, { year: "numeric", month: "long", day: "numeric" });
		}

		if (isThisYear(date)) {
			return formatter.dateTime(date, {
				month: "long",
				day: "numeric",
				...(withTime ? { hour: "numeric", minute: "numeric" } : {}),
			});
		}

		return formatter.dateTime(date, {
			year: "numeric",
			month: "long",
			day: "numeric",
			...(withTime ? { hour: "numeric", minute: "numeric" } : {}),
		});
	}
	return handler;
}
