import { createFileRoute } from "@tanstack/react-router";
import { Settings2, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "use-intl";
import { Button } from "@/components/extendui/button";
import { Input } from "@/components/extendui/input";
import SelectTrigger, { Select, SelectContent, SelectItem, SelectValue } from "@/components/extendui/select";
import LoadingScreen from "@/components/loading-screen";
import PageContainer from "@/components/page-container";
import { db } from "@/lib/db";
import CourseDialog from "./-components/course-dialog";

export const Route = createFileRoute("/dashboard/courses/")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useTranslations();

	const { data, isLoading } = db.useQuery({
		courses: {},
	});
	const [sort, setSort] = useState("ascending");
	const [searchTerm, setSearchTerm] = useState("");

	const [courseModalOpen, setCourseModalOpen] = useState(false);
	const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

	const filteredCourses = (data?.courses || [])
		.sort((a, b) => (sort === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
		.filter((sub) => sub.name.toLowerCase().includes(searchTerm.toLowerCase()));

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<>
			<CourseDialog
				open={courseModalOpen}
				setOpen={setCourseModalOpen}
				course={filteredCourses.find((c) => c.id === activeCourseId)}
			/>

			<PageContainer
				headerClassName="flex h-12 w-full"
				header={
					<>
						<Input
							placeholder={t("search-courses")}
							className="flex-1 border-0 w-[400px]"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>

						<div className="flex gap-4">
							<Button
								onClick={() => {
									setActiveCourseId(null);
									setCourseModalOpen(true);
								}}
							>
								{t("add-course")}
							</Button>
							<Select value={sort} onValueChange={setSort}>
								<SelectTrigger className="w-16">
									<SelectValue>
										<Settings2 size={18} />
									</SelectValue>
								</SelectTrigger>
								<SelectContent align="end">
									<SelectItem value="ascending">
										<div className="flex items-center gap-4">
											<SortAsc size={16} />
											<span>{t("asc")}</span>
										</div>
									</SelectItem>
									<SelectItem value="descending">
										<div className="flex items-center gap-4">
											<SortDesc size={16} />
											<span>{t("desc")}</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</>
				}
			>
				{filteredCourses.length === 0 ? (
					<div className="flex flex-1 h-54 items-center justify-center">{t("no-results")}</div>
				) : (
					<ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.map((course) => {
							return (
								<li
									key={course.name}
									className="rounded-lg border p-4 hover:shadow-md flex justify-between items-start"
								>
									<div className="flex flex-col">
										<h2 className="mb-1 font-semibold">{course.name}</h2>
										<p className="line-clamp-5 text-gray-500 text-wrap flex-wrap w-full">
											{course.subject}
											<br />
											Duration: {course.duration} months
											<br />
											Monthly payment: {course.price}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setActiveCourseId(course.id);
											setCourseModalOpen(true);
										}}
									>
										{t("edit")}
									</Button>
								</li>
							);
						})}
					</ul>
				)}
			</PageContainer>
		</>
	);
}
