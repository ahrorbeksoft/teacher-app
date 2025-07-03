"use client";
import { Button } from "@/components/extendui/button";
import { AppForm, useAppForm } from "@/components/reusables/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useFormat from "@/hooks/use-formatter";
import type { Group, Student } from "@/lib/types";
import { id } from "@instantdb/react";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "use-intl";

export default function StudentSheet({
  student,
  open,
  setOpen,
  data,
}: {
  student?: Student;
  open: boolean;
  setOpen: (open: boolean) => void;
  data: { groups: Group[] };
}) {
  const groups = data.groups.filter(
    (g) => !student?.subscriptions.map((s) => s.group?.id).includes(g.id),
  );

  const t = useTranslations();
  const format = useFormat();

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      privateNumber: "",
      homeNumber: "",
      birthday: undefined,
      subscriptions: [],
    } as {
      fullName: string;
      privateNumber: string;
      homeNumber: string;
      birthday: undefined | Date;
      subscriptions: {
        id: string;
        fromDate: Date;
        group: string;
      }[];
    },
    validators: {
      onSubmit: (val) => {},
    },
  });

  useEffect(() => {
    if (open) {
      if (student) {
        form.reset({
          fullName: student.fullName,
          privateNumber: student.privateNumber ?? "",
          homeNumber: student.homeNumber ?? "",
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
          <SheetTitle>
            {student ? t("edit-student") : t("add-student")}
          </SheetTitle>
          <SheetDescription>
            {student
              ? t("edit-student-description")
              : t("add-student-description")}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="p-4 h-[calc(100vh-75px)]">
          <AppForm
            className="space-y-8 pb-4 px-1"
            onSubmit={() => {
              form.handleSubmit();
            }}
          >
            <div className="space-y-4">
              <form.AppField
                name="fullName"
                children={(field) => <field.TextField label={t("full-name")} />}
              />
              <form.AppField
                name="privateNumber"
                children={(field) => (
                  <field.TextField extra="phone" label={t("private-number")} />
                )}
              />
              <form.AppField
                name="homeNumber"
                children={(field) => (
                  <field.TextField extra="phone" label={t("home-number")} />
                )}
              />
              <form.AppField
                name="birthday"
                children={(field) => (
                  <field.DatePickerField
                    formatter={(date) => format(date, "birthday") || ""}
                    label={t("birthday")}
                  />
                )}
              />
              <form.Field name="subscriptions" mode="array">
                {(field) => {
                  return (
                    <div className="flex-col space-y-4">
                      {student?.subscriptions.map((s, i) => {
                        return (
                          <div
                            className="flex-col p-3 border-dashed border rounded-xl space-y-4"
                            key={i}
                          >
                            {s.group?.name}{" "}
                            <span className="text-sm text-muted-foreground">
                              (
                              {t("from-to-date", {
                                from: format(s.group?.fromDate) ?? "",
                                to: t("now"),
                              })}
                              )
                            </span>
                          </div>
                        );
                      })}
                      {field.state.value.map((item, i) => {
                        return (
                          <div
                            className="flex-col p-3 border-dashed border rounded-xl space-y-4"
                            key={i}
                          >
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
                                    disabled: field.state.value
                                      .map((v) => v.group)
                                      .includes(g.id),
                                  }))}
                                  label={t("group-number", { num: i + 1 })}
                                />
                              )}
                            />
                            <form.AppField
                              name={`subscriptions[${i}].fromDate`}
                              children={(sub) => (
                                <sub.DatePickerField label={t("from-date")} />
                              )}
                            />
                            <Button
                              variant="secondary"
                              className="w-full"
                              onClick={() => {
                                field.handleChange((value) =>
                                  value.filter((v) => v.id !== item.id),
                                );
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
                          onClick={() =>
                            field.pushValue({
                              id: id(),
                              group: "",
                              fromDate: new Date(),
                            })
                          }
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
