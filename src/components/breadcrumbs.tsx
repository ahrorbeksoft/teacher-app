import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, isMatch, useMatches } from "@tanstack/react-router";

const BreadcrumbRender = ({
	index,
	length,
	href,
	children,
}: {
	index: number;
	length: number;
	href: string;
	children: React.ReactNode;
}) => {
	if (index + 1 === length) {
		return (
			<BreadcrumbItem>
				<BreadcrumbPage className="text-2xl md:text-base">{children}</BreadcrumbPage>
			</BreadcrumbItem>
		);
	}
	return (
		<>
			<BreadcrumbItem className="hidden md:block">
				<BreadcrumbLink className="text-base" asChild>
					<Link to={href}>{children}</Link>
				</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator className="hidden md:block" />
		</>
	);
};

const Breadcrumbs = () => {
	const matches = useMatches();
	if (matches.some((match) => match.status === "pending")) return null;
	const matchesWithCrumbs = matches.filter((match) => isMatch(match, "loaderData.crumb"));

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, index) => (
					<BreadcrumbRender key={match.pathname} index={index} length={matchesWithCrumbs.length} href={match.pathname}>
						{match.loaderData?.crumb}
					</BreadcrumbRender>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default Breadcrumbs;
