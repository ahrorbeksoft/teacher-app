import Dropdown from "@/components/dropdown";
import { Button } from "@/components/extendui/button";
import SmsIcon from "@/components/icons/sms-icon";
import UserBoyIcon from "@/components/icons/user-boy-icon";
import UserGirlIcon from "@/components/icons/user-girl-icon";
import { DataTable, type DataTableOptions } from "@/components/reusables/data-table/data-table";
import { useConfirm } from "@/components/ui/alert-dialog-provider";
import { Badge } from "@/components/ui/badge";

import useInstantErrorHandler from "@/hooks/use-error-handler";
import useFormat from "@/hooks/use-formatter";
import { db } from "@/lib/db";
import { profileStore } from "@/lib/stores";
import type { Student } from "@/lib/types";
import { getFullName } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import StudentSheet from "./-components/student-sheet";

export const Route = createFileRoute("/dashboard/students")({
	loader: ({ context }) => {
		return { crumb: context.t("students") };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const t = useTranslations();
	const format = useFormat();
	const nameOrder = useStore(profileStore, (profile) => profile.nameOrder);
	const handleInstantError = useInstantErrorHandler();

	const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
	const [studentSheetOpen, setStudentSheetOpen] = useState(false);

	useEffect(() => {
		if (!studentSheetOpen) {
			setActiveStudentId(null);
		}
	}, [studentSheetOpen]);

	const confirm = useConfirm();

	const { data } = db.useQuery({
		students: {
			subscriptions: {
				group: {},
			},
		},
		groups: {},
	});

	const options: DataTableOptions<Student, unknown> = {
		tableName: "employees",
		search: {
			type: "single",
			placeholder: t("search-students"),
			column: "fullName",
		},
		columns: [
			// full name
			{
				id: "fullName",
				accessorFn: (row) => {
					return getFullName(row.firstName, row.lastName, nameOrder);
				},
				header: t("full-name"),
				enableSorting: true,
				enableHiding: false,
				cell: ({ row }) => {
					const Icon = row.original.gender === "female" ? UserGirlIcon : UserBoyIcon;
					const student = row.original;
					const full_name = getFullName(student.firstName, student.lastName, nameOrder);
					return (
						<Link className="flex items-center gap-2" to="/dashboard/students/$id" params={{ id: student.id }}>
							<Icon className="h-4 w-4" />
							{full_name}
						</Link>
					);
				},
			},
			// private Number
			{
				id: "privateNumber",
				header: t("private-number"),
				enableSorting: true,
			},
			// home number
			{
				id: "homeNumber",
				header: t("home-number"),
				enableSorting: true,
			},
			{
				id: "gender",
				header: t("gender"),
				enableSorting: true,
			},

			{
				id: "birthday",
				header: t("birthday"),
				enableSorting: true,
				cell: ({ row }) => {
					const birthday = row.original.birthday;
					return (
						<>
							{birthday ? (
								format(birthday, "birthday")
							) : (
								<Badge className="font-semibold text-white text-xs bg-gray-500">{t("n-a")}</Badge>
							)}
						</>
					);
				},
			},
			// {
			// 	id: "groupsSubscriptions",
			// 	header: t("groups"),
			// 	accessorFn: (row) =>
			// 		row.groupsSubscriptions
			// 			.filter((g) => g.isActive)
			// 			.flatMap((s) => s.group)
			// 			.map((g) => g?.id),
			// 	cell: ({ row }) => {
			// 		const groups = row.original.groupsSubscriptions.flatMap((s) => s.group);

			// 		return (
			// 			<>
			// 				{groups.length > 0 ? (
			// 					<div className="flex gap-2">
			// 						{groups.map((g) => (
			// 							<Button asChild size="sm" className="h-7" variant="secondary" key={g?.id}>
			// 								<Link to="/dashboard/groups/$id" params={{ id: g?.id ?? "error" }}>
			// 									{g?.name}
			// 								</Link>
			// 							</Button>
			// 						))}
			// 					</div>
			// 				) : (
			// 					<Badge className="font-semibold text-white text-xs bg-gray-500">{t("n-a")}</Badge>
			// 				)}
			// 			</>
			// 		);
			// 	},
			// },
			{
				id: "createdAt",
				header: t("created-at"),
				enableSorting: true,
				align: "center",
				cell: ({ row }) => {
					if (!row.original.createdAt)
						return <Badge className="font-semibold text-white text-xs bg-gray-500">{t("n-a")}</Badge>;

					return <div>{format(row.original.createdAt, "custom")}</div>;
				},
			},
			{
				id: "updatedAt",
				header: t("updated-at"),
				enableSorting: true,
				align: "center",
				cell: ({ row }) => {
					if (!row.original.updatedAt)
						return <Badge className="font-semibold text-white text-xs bg-gray-500">{t("n-a")}</Badge>;
					return <div>{format(row.original.updatedAt, "custom")}</div>;
				},
			},
		],
		rowAction({ row }) {
			const id = row.original.id;
			return (
				<Dropdown
					label={t("actions")}
					items={[
						{
							label: (
								<>
									<SmsIcon /> Send a message
								</>
							),
							onClick: () => {},
						},
					]}
				/>
			);
		},
		bulkActions: [
			{
				label: (
					<div className="flex items-center gap-2 font-medium">
						<DeleteIcon /> {t("delete")}
					</div>
				),
				confirm: {
					title: t("are-you-sure"),
					body: t("really-delete-plural", { name: t("students").toLowerCase() }),
					cancelButton: t("cancel"),
					cancelButtonVariant: "outline",
					actionButton: t("continue"),
				},
				onClick: async (rows) => {
					try {
						await db.transact(rows.map((r) => db.tx.students[r.original.id].delete()));
						toast.success(t("toast.delete-successfull-singular", { name: t("students") }));
					} catch (err) {
						handleInstantError(err);
					}
				},
			},
		],
		hiddenColumns: ["gender", "updatedAt", "homeNumber"],
		facetedFilters: [
			{
				column: "gender",
				title: t("gender"),
				options: [
					{ label: t("genders", { gender: "male" }), value: "male" },
					{ label: t("genders", { gender: "female" }), value: "female" },
				],
			},
			// {
			// 	column: "groupsSubscriptions",
			// 	title: t("groups"),
			// 	options:
			// 		branch?.groups.map((g) => ({
			// 			label: g.name,
			// 			value: g.id,
			// 		})) ?? [],
			// },
			// {
			// 	column: "role",
			// 	title: t("role"),
			// },
		],
		Buttons: (
			<>
				<Button onClick={() => setStudentSheetOpen(true)}>{t("add-student")}</Button>
			</>
		),
	};

	return (
		<>
			<StudentSheet
				open={studentSheetOpen}
				setOpen={setStudentSheetOpen}
				student={data?.students?.find((s) => s.id === activeStudentId)}
				data={{ groups: data?.groups || [] }}
			/>
			<DataTable data={data?.students || []} scrollableClassName="h-[calc(100vh-170px)]" options={options} />
		</>
	);
}
