import { id } from "@instantdb/react";
import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import z from "zod";
import { AppForm, useAppForm } from "@/components/reusables/form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useInstantErrorHandler from "@/hooks/use-error-handler";
import { db } from "@/lib/db";
import { profileStore } from "@/lib/stores";
import { Course } from "@/lib/types";
import { timestamps } from "@/lib/utils";

export default function CourseDialog({
	open,
	setOpen,
	course,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	course?: Course;
}) {
	const t = useTranslations();

	const profile = useStore(profileStore);

	const handleInstantError = useInstantErrorHandler();

	const courseSchema = z.object({
		name: z.string({ message: t("input.required", { name: t("name") }) }),
		subject: z.string({ message: t("input.required", { name: t("subject") }) }),
		duration: z
			.number()
			.min(1, { message: t("duration-min") })
			.max(12, { message: t("duration-max") }),
		price: z.number().min(1, { message: t("input.required", { name: t("monthly-price") }) }),
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			subject: "",
			duration: 1,
			price: 0,
		} as z.infer<typeof courseSchema>,
		validators: {
			onSubmit: courseSchema,
		},

		onSubmit: async ({ value: formData }) => {
			try {
				if (course) {
					await db.transact(
						db.tx.courses[course.id].update(
							{
								name: formData.name,
								subject: formData.subject,
								price: formData.price,
								duration: formData.duration,
								...timestamps().update,
							},
							{ upsert: false },
						),
					);

					toast.success(t("toast.edit-successfull-singular", { name: t("course") }));

					toast;
				} else {
					await db.transact(
						db.tx.courses[id()]
							.create({
								name: formData.name,
								subject: formData.subject,
								price: formData.price,
								duration: formData.duration,
								...timestamps().insert,
							})
							.link({
								profile: profile.id,
							}),
					);
					toast.success(t("toast.add-successfull-singular", { name: t("course") }));
				}

				setOpen(false);

				// Handle successful form submission
			} catch (err) {
				handleInstantError(err);
				// Handle validation errors
			}
		},
	});

	useEffect(() => {
		if (open && course) {
			form.reset({
				name: course.name,
				subject: course.subject,
				duration: course.duration,
				price: course.price,
			});
		}

		if (!open) {
			form.reset();
		}
	}, [open, course]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{course ? t("edit-course") : t("add-course")}</DialogTitle>
					<DialogDescription>{course ? t("edit-course-description") : t("add-course-description")}</DialogDescription>
				</DialogHeader>

				<AppForm
					onSubmit={() => {
						form.handleSubmit();
					}}
					className="flex-col space-y-6"
				>
					<form.AppField name="name" children={(field) => <field.TextField label={t("name")} />} />
					<form.AppField name="subject" children={(field) => <field.TextField label={t("subject")} />} />
					<form.AppField
						name="price"
						children={(field) => <field.TextField extra="currency" label={t("monthly-price")} />}
					/>

					<form.AppField
						name="duration"
						children={(field) => <field.NumberInput min={1} max={12} label={t("course-duration")} />}
					/>

					<DialogFooter>
						<form.AppForm>
							<form.Button
								label={t("cancel")}
								onClick={() => {
									setOpen(false);
								}}
							/>
							<form.SubmitButton label={course ? t("save") : t("add")} />
						</form.AppForm>
					</DialogFooter>
				</AppForm>
			</DialogContent>
		</Dialog>
	);
}
