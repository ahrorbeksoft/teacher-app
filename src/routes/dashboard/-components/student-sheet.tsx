"use client";
import { Button } from "@/components/extendui/button";
import { AppForm, useAppForm } from "@/components/reusables/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useInstantErrorHandler from "@/hooks/use-error-handler";
import useFormat from "@/hooks/use-formatter";
import useSchema from "@/hooks/use-schema";
import { db } from "@/lib/db";
import type { Group, Student } from "@/lib/types";
import { getLessonDatesInFirstMonth, getTotalMonthlyLessons } from "@/lib/utils";
import { id } from "@instantdb/react";
import { useStore } from "@tanstack/react-store";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import type { z } from "zod";

export default function StudentSheet({
	student,
	open,
	setOpen,
	data,
}: { student?: Student; open: boolean; setOpen: (open: boolean) => void; data: { groups: Group[] } }) {
	const groups = data.groups.filter((g) => !student?.subscriptions.map((s) => s.group?.id).includes(g.id));

	const t = useTranslations();
	const format = useFormat();

	const handleInstantError = useInstantErrorHandler();

	const { studentSchema } = useSchema();

	const form = useAppForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			privateNumber: "",
			homeNumber: "",
			gender: "",
			birthday: undefined,
			subscriptions: [],
		} as z.infer<typeof studentSchema>,
		validators: {
			// @ts-ignore
			onSubmit: studentSchema,
		},
		// onSubmit: async ({ value: values }) => {
		// 	try {
		// 		const batch = [];

		// 		const studentId = student?.id ?? id();

		// 		if (values.subscriptions.length > 0) {
		// 			values.subscriptions.map((s) => {
		// 				const selectedGroup = groups.find((g) => g.id === s.group);
		// 				if (!selectedGroup) return;

		// 				const monthlyPrice = selectedGroup?.paymentAmount ?? 0;

		// 				const totalMonthlyLessons = getTotalMonthlyLessons(selectedGroup.lessonDays, selectedGroup.customDays);

		// 				const totalLessons = getLessonDatesInFirstMonth(
		// 					selectedGroup.lessonDays,
		// 					s.fromDate,
		// 					new Date(selectedGroup.toDate ?? new Date()),
		// 				).length;

		// 				const dueAmount =
		// 					totalLessons > totalMonthlyLessons
		// 						? monthlyPrice
		// 						: Math.round(((monthlyPrice / totalMonthlyLessons) * totalLessons) / 1000) * 1000;

		// 				// adding the subscription
		// 				batch.push(
		// 					db.tx.studentSubscriptions[s.id]
		// 						.update({
		// 							fromDate: s.fromDate.getTime(),
		// 							toDate: selectedGroup.toDate,
		// 							isActive: true,
		// 							...timestamps(),
		// 						})
		// 						.link({ group: s.group }),
		// 				);

		// 				// adding the invoice
		// 				batch.push(
		// 					db.tx.studentInvoices[id()]
		// 						.update({
		// 							amount: dueAmount,
		// 							month: s.fromDate.getTime(),
		// 							...timestamps(),
		// 						})
		// 						.link({
		// 							student: studentId,
		// 							studentSubscription: s.id,
		// 						}),
		// 				);
		// 			});
		// 		}
		// 		if (student) {
		// 			batch.push(
		// 				db.tx.students[studentId]
		// 					.update({
		// 						firstName: values.firstName,
		// 						lastName: values.lastName,
		// 						privateNumber: values.privateNumber,
		// 						homeNumber: values.homeNumber,
		// 						email: values.email,
		// 						birthday: values.birthday?.getTime(),
		// 						gender: values.gender || undefined,
		// 						...timestamps(false),
		// 					})
		// 					.link(
		// 						values.subscriptions.length > 0
		// 							? {
		// 									groupsSubscriptions: values.subscriptions.map((s) => s.id),
		// 								}
		// 							: {},
		// 					),
		// 			);
		// 			toast.success(t("toast.edit-successfull-singular", { name: t("student") }));
		// 		} else {
		// 			batch.push(
		// 				db.tx.students[studentId]
		// 					.update({
		// 						firstName: values.firstName,
		// 						lastName: values.lastName,
		// 						privateNumber: values.privateNumber,
		// 						homeNumber: values.homeNumber,
		// 						email: values.email,
		// 						birthday: values.birthday?.getTime(),
		// 						gender: values.gender || undefined,
		// 						status: "active",
		// 						...timestamps(),
		// 					})
		// 					.link({
		// 						centers: activeBranchId,
		// 					})
		// 					.link(
		// 						values.subscriptions.length > 0
		// 							? {
		// 									groupsSubscriptions: values.subscriptions.map((s) => s.id),
		// 								}
		// 							: {},
		// 					),
		// 			);
		// 			toast.success(t("toast.add-successfull-singular", { name: t("student") }));
		// 		}
		// 		await db.transact(batch);
		// 		setOpen(false);
		// 	} catch (err) {
		// 		handleInstantError(err);
		// 	}
		// },
	});

	useEffect(() => {
		if (open) {
			if (student) {
				form.reset({
					firstName: student.firstName ?? "",
					lastName: student.lastName ?? "",
					privateNumber: student.privateNumber ?? "",
					homeNumber: student.homeNumber ?? "",
					gender: student.gender ?? "",
					subscriptions:
						student.subscriptions
							.filter((s) => s.isActive)
							.map((s) => ({
								id: s.id,
								fromDate: new Date(s.fromDate),
								group: s.group?.id ?? "",
							})) ?? [],

					birthday: student.birthday ? new Date(student.birthday) : undefined,
				});
			} else {
				form.reset();
			}
		}
	}, [open, student]);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent className="p-0">
				<SheetHeader className="p-4">
					<SheetTitle>{student ? t("edit-student") : t("add-student")}</SheetTitle>
					<SheetDescription>{student ? t("edit-student-description") : t("add-student-description")}</SheetDescription>
				</SheetHeader>
				<ScrollArea className="p-4 h-[calc(100vh-75px)]">
					<AppForm
						className="space-y-8 pb-4 px-1"
						onSubmit={() => {
							form.handleSubmit();
						}}
					>
						<div className="space-y-4">
							<form.AppField name="firstName" children={(field) => <field.TextField label={t("first-name")} />} />
							<form.AppField name="lastName" children={(field) => <field.TextField label={t("last-name")} />} />
							<form.AppField
								name="privateNumber"
								children={(field) => <field.TextField extra="phone" label={t("private-number")} />}
							/>
							<form.AppField
								name="homeNumber"
								children={(field) => <field.TextField extra="phone" label={t("home-number")} />}
							/>
							<form.AppField
								name="gender"
								children={(field) => (
									<field.SelectField
										placeholder={t("select-gender")}
										label={t("gender")}
										options={[
											{
												label: t("genders", { gender: "male" }),
												value: "male",
											},
											{
												label: t("genders", { gender: "female" }),
												value: "female",
											},
										]}
									/>
								)}
							/>
							<form.AppField
								name="birthday"
								children={(field) => (
									<field.DatePickerField formatter={(date) => format(date, "birthday") || ""} label={t("birthday")} />
								)}
							/>
							<form.Field name="subscriptions" mode="array">
								{(field) => {
									return (
										<div className="flex-col space-y-4">
											{student?.subscriptions.map((s, i) => {
												return (
													<div className="flex-col p-3 border-dashed border rounded-xl space-y-4" key={i}>
														{s.group?.name}{" "}
														<span className="text-sm text-muted-foreground">
															({t("from-to-date", { from: format(s.group?.fromDate) ?? "", to: t("now") })})
														</span>
													</div>
												);
											})}
											{field.state.value.map((item, i) => {
												return (
													<div className="flex-col p-3 border-dashed border rounded-xl space-y-4" key={i}>
														<form.AppField
															name={`subscriptions[${i}].group`}
															children={(sub) => (
																<sub.SearchableSelectField
																	searchText={t("search-groups")}
																	notFoundText={t("no-results")}
																	placeholder={t("select-group")}
																	options={groups.map((g) => ({
																		label: <div>{g.name}</div>,
																		value: g.id,
																		disabled: field.state.value.map((v) => v.group).includes(g.id),
																	}))}
																	label={t("group-number", { num: i + 1 })}
																/>
															)}
														/>
														<form.AppField
															name={`subscriptions[${i}].fromDate`}
															children={(sub) => <sub.DatePickerField label={t("from-date")} />}
														/>
														<Button
															variant="secondary"
															className="w-full"
															onClick={() => {
																field.handleChange((value) => value.filter((v) => v.id !== item.id));
															}}
														>
															<XIcon className="w-4 h-4" />
															{t("remove-group")}
														</Button>
													</div>
												);
											})}

											{groups.length > 0 && (
												<Button
													className="w-full"
													variant="outline"
													onClick={() => field.pushValue({ id: id(), group: "", fromDate: new Date() })}
													type="button"
												>
													{t("add-to-group")}
												</Button>
											)}
										</div>
									);
								}}
							</form.Field>
							{/* <form.AppField
								name="groups"
								children={(field) => (
									<field.BetterMultiSelectField
										emptyText={t("no-options-left")}
										placeholder={t("select-groups")}
										renderSelectedCount={(count) => t("selected-groups-count", { count })}
										label={t("groups")}
										options={data.groups.map((g) => ({
											label: (
												<div className="text-xs">
													{g.name} ({g.subject?.name})
													<br />
													{g.lessonDays === "custom"
														? g.customDays?.map((day) => t("week-days-label", { day })).join(", ")
														: t("lesson-days-label", { day: g.lessonDays })}
													<div className="flex items-center gap-2">
														{g.fromTime} - {g.toTime}
													</div>
												</div>
											),
											value: g.id,
										}))}
									/>
								)}
							/> */}
						</div>
						<form.AppForm>
							<div className="flex items-center gap-2 justify-end">
								<form.Button
									onClick={() => {
										setOpen(false);
									}}
									label={t("cancel")}
								/>
								<form.SubmitButton label={student ? t("save") : t("add")} />
							</div>
						</form.AppForm>
					</AppForm>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
