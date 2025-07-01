import PageContainer from "@/components/page-container";
import { AppForm, useAppForm } from "@/components/reusables/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/reusables/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import useInstantErrorHandler from "@/hooks/use-error-handler";
import useSchema from "@/hooks/use-schema";
import { db } from "@/lib/db";
import { profileStore } from "@/lib/stores";
import { cn, getFullName, timestamps } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import type { z } from "zod";

export const Route = createFileRoute("/dashboard/settings")({
	loader: ({ context }) => {
		return { crumb: context.t("settings") };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const profile = useStore(profileStore);

	const { profileSchema, smsSettingsSchema } = useSchema();
	const instantHandler = useInstantErrorHandler();

	const { isMobile, open: sidebarOpen } = useSidebar();
	const t = useTranslations();

	const profileForm = useAppForm({
		defaultValues: {
			firstName: profile.firstName,
			lastName: profile.lastName,
			nameOrder: profile.nameOrder,
		} as z.infer<typeof profileSchema>,
		validators: {
			onSubmit: profileSchema,
		},
		onSubmit: async ({ value: formData }) => {
			try {
				await db.transact(
					db.tx.profiles[profile.id].update({
						firstName: formData.firstName,
						lastName: formData.lastName,
						nameOrder: formData.nameOrder,
						...timestamps(false),
					}),
				);
				toast.success(t("toast.save-successfull-plural", { name: t("settings") }));
			} catch (err) {
				instantHandler(err);
			}
		},
	});

	const smsForm = useAppForm({
		defaultValues: {
			smsLogin: profile.smsLogin ?? "",
			smsPassword: profile.smsPassword ?? "",
			isSmsActive: profile.isSmsActive,
		} as z.infer<typeof smsSettingsSchema>,

		validators: {
			onSubmit: smsSettingsSchema,
		},
		onSubmit: async ({ value: formData }) => {
			try {
				await db.transact(
					db.tx.profiles[profile.id].update({
						isSmsActive: formData.isSmsActive,
						smsLogin: formData.smsLogin,
						smsPassword: formData.smsPassword,
						...timestamps(false),
					}),
				);
				toast.success(t("toast.save-successfull-plural", { name: t("settings") }));
			} catch (err) {
				instantHandler(err);
			}
		},
	});

	const isSmsActive = useStore(smsForm.store, (state) => state.values.isSmsActive);

	return (
		<Tabs defaultValue="profile">
			<PageContainer
				scrollable={false}
				container={false}
				header={
					<TabsList>
						<TabsTrigger value="profile">
							<div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
								{t("profile")}
							</div>
						</TabsTrigger>
						<TabsTrigger value="sms">
							<div className="flex flex-row items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
								{t("sms-settings")}
							</div>
						</TabsTrigger>
					</TabsList>
				}
			>
				<ScrollArea
					className={cn(
						"p-5",
						"md:h-[calc(100vh-105px)]",
						isMobile ? "w-screen" : !sidebarOpen ? "w-[calc(100vw-3rem-380px)]" : "w-[calc(100vw-16rem-380px)]",
					)}
				>
					<TabsContent value="profile" className="@container">
						<h1 className="text-3xl">{t("profile-settings")}</h1>
						<AppForm
							className="flex flex-col px-4 py-6 gap-4"
							onSubmit={() => {
								profileForm.handleSubmit();
							}}
						>
							<profileForm.AppField
								name="firstName"
								children={(field) => <field.TextField required={true} label={t("first-name")} />}
							/>
							<profileForm.AppField
								name="lastName"
								children={(field) => <field.TextField required={true} label={t("last-name")} />}
							/>
							<profileForm.AppField
								name="nameOrder"
								children={(field) => (
									<field.SelectField
										label={t("name-order")}
										placeholder={t("select-name-order")}
										required={true}
										options={[
											{
												value: "first",
												label: getFullName(profile.firstName, profile.lastName, "first"),
											},
											{
												value: "last",
												label: getFullName(profile.firstName, profile.lastName, "last"),
											},
										]}
									/>
								)}
							/>

							<profileForm.AppForm>
								<div className="flex justify-end">
									<profileForm.SubmitButton loadingText={t("saving-dot")} label={t("save")} />
								</div>
							</profileForm.AppForm>
						</AppForm>
					</TabsContent>
					<TabsContent value="sms" className="w-full @container">
						<h1 className="text-3xl">{t("sms-settings")}</h1>
						<AppForm
							className="flex flex-col px-4 py-6 gap-4"
							onSubmit={() => {
								smsForm.handleSubmit();
							}}
						>
							<smsForm.AppField name="isSmsActive" children={(field) => <field.CheckboxField label={t("active")} />} />
							<smsForm.AppField
								name="smsLogin"
								children={(field) => <field.TextField disabled={!isSmsActive} label={t("login")} />}
							/>
							<smsForm.AppField
								name="smsPassword"
								children={(field) => <field.TextField disabled={!isSmsActive} label={t("password")} />}
							/>

							<smsForm.AppForm>
								<div className="flex justify-end">
									<smsForm.SubmitButton loadingText={t("saving-dot")} label={t("save")} />
								</div>
							</smsForm.AppForm>
						</AppForm>
					</TabsContent>
					<ScrollBar orientation="horizontal" />
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</PageContainer>
		</Tabs>
	);
}
