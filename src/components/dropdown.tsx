import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./extendui/button";

type Item =
	| {
			label: React.ReactNode;
			onClick?: () => void;
			asChild?: boolean;
	  }
	| "sep";

type DropdownProps = {
	label: string;
	items: Item[];
};

export default function Dropdown({ items, label }: DropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-7 w-7 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{label}</DropdownMenuLabel>
				{items.map((item, index) =>
					item === "sep" ? (
						<DropdownMenuSeparator key={index} />
					) : (
						<DropdownMenuItem
							key={index}
							onClick={() => {
								item.onClick?.();
							}}
							asChild={item.asChild}
						>
							{item.label}
						</DropdownMenuItem>
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
