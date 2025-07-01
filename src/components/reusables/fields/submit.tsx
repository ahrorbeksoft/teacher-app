import { Button } from "@/components/extendui/button";
import { useFormContext } from "../form";

export default function ButtonField(props: React.ComponentProps<typeof Button> & { label: string }) {
	const form = useFormContext();

	function isPrestine(values: any) {
		// return Object.keys(values).every((key) => values[key] === form.options.defaultValues?.[key]);
		// i think this is better solution for checking if the form is pristine
		return JSON.stringify(form.options.defaultValues) === JSON.stringify(values);
	}

	return (
		<form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, values: state.values })}>
			{({ isSubmitting, values }) => (
				<Button type="submit" loading={isSubmitting} disabled={isSubmitting || isPrestine(values)} {...props}>
					{props.label}
				</Button>
			)}
		</form.Subscribe>
	);
}
