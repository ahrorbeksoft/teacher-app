import { lesson_days, payment_day, week_days } from "@/lib/constants";
import { getDateFromTime } from "@/lib/utils";
import { getHours, getMinutes } from "date-fns";
import { useTranslations } from "use-intl";
import { z } from "zod";

export default function useSchema() {
	const t = useTranslations();

	// reusables
	const text_input = (name: string, min: number, max: number) =>
		z.string().min(min, t("input.min", { name, min })).max(max, t("input.max", { max, name }));
	const phone_number = z
		.string()
		.optional()
		.refine(
			(value) => !value || /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/.test(value ?? ""),
			t("input.invalid", { name: t("phone-number") }),
		);
	// const email = z.string().email(t("input.invalid", { name: t("email") }));
	const required_input = (name: string) => z.string().min(1, t("input.required", { name }));

	const groupSchema = z
		.object({
			name: text_input(t("name"), 2, 50),
			fromTime: required_input(t("from-time")),
			toTime: required_input(t("to-time")),
			fromDate: z.date({ message: t("input.required", { name: t("from-date") }) }),
			toDate: z.date({ message: t("input.required", { name: t("to-date") }) }),
			lessonDays: z.enum(lesson_days, {
				message: t("lesson-days-required"),
			}),
			customDays: z.enum(week_days).array().optional(),
		})
		.superRefine((form, ctx) => {
			// to cannot be before from
			if (form.fromTime.trim() !== "" && form.toTime.trim() !== "") {
				const from = getDateFromTime(form.fromTime);
				const to = getDateFromTime(form.toTime);

				if (
					!from ||
					!to ||
					(getHours(from) === 0 && getMinutes(from) === 0) ||
					(getHours(to) === 0 && getMinutes(to) === 0)
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Required",
						path: ["fromTime"],
					});
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Required",
						path: ["toTime"],
					});
				}

				if (from > to) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "To time cannot be before from time",
						path: ["toTime"],
					});
				}
			}

			if (form.lessonDays === "custom" && !form.customDays) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t("input.required", { name: t("custom-days") }),
					path: ["customDays"],
				});
			}

			if (form.fromDate && form.toDate && form.fromDate > form.toDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t("to-date-cannot-be-before-from-date"),
					path: ["toDate"],
				});
			}
		});

	const smsSettingsSchema = z
		.object({
			isSmsActive: z.boolean(),
			smsLogin: z.string(),
			smsPassword: z.string(),
		})
		.superRefine((form, ctx) => {
			if (form.isSmsActive) {
				if (!form.smsLogin) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t("input.required", { name: t("sms-login") }),
						path: ["smsLogin"],
					});
				}
				if (!form.smsPassword) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t("input.required", { name: t("sms-password") }),
						path: ["smsPassword"],
					});
				}
			}
		});

	const profileSchema = z.object({
		firstName: required_input(t("first-name")),
		lastName: required_input(t("last-name")),
		nameOrder: z.enum(["first", "last"], { message: t("input.invalid", { name: t("name-order") }) }).optional(),
	});

	const studentSchema = z.object({
		firstName: text_input(t("first-name"), 2, 50),
		lastName: text_input(t("last-name"), 2, 50),
		privateNumber: z.string(),
		homeNumber: z.string(),
		birthday: z.date().optional(),
		gender: z.enum(["male", "female"]).optional().or(z.literal("")),
		subscriptions: z
			.array(
				z.object({
					id: z.string(),
					fromDate: z.date({ message: t("input.invalid", { name: t("from-date") }) }),
					group: required_input(t("group")),
				}),
			)
			.default([]),
	});

	return { groupSchema, smsSettingsSchema, profileSchema, studentSchema };
}
