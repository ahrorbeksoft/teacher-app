"use client";
import { Button } from "@/components/extendui/button";

export default function ButtonField(props: React.ComponentProps<typeof Button> & { label: string }) {
	return (
		<Button variant="secondary" type="button" {...props}>
			{props.label}
		</Button>
	);
}
