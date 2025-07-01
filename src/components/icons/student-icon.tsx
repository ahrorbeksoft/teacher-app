import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

function StudentIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			fill={cn("fill-current", className)}
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 49.999 49.999"
			xmlSpace="preserve"
			{...props}
		>
			<g>
				<g>
					<path
						d="M20.202,21.976c-0.488,0.124-0.966,0.269-1.439,0.426c3.119,0.527,5.05,1.416,6.236,2.33
					c1.186-0.914,3.119-1.803,6.239-2.33c-0.472-0.157-0.95-0.302-1.437-0.426c3.513-2.371,5.936-7.031,5.936-11.233
					C35.737,4.806,30.931,0,25,0c-5.934,0-10.737,4.806-10.737,10.742C14.264,14.944,16.685,19.604,20.202,21.976z"
					/>
					<path
						d="M39.629,24.539v-1.532h-0.504c-9.789,0-13.066,2.337-14.126,3.604c-1.06-1.269-4.338-3.604-14.126-3.604h-0.504v1.532
					c-0.452-0.01-0.904-0.017-1.379-0.017H7.846v22.199h1.143c12.068,0,14.533,2.771,14.884,3.278h2.27
					c0.38-0.538,2.893-3.278,14.865-3.278h1.145V24.522h-1.145C40.534,24.522,40.081,24.529,39.629,24.539z"
					/>
				</g>
			</g>
		</svg>
	);
}

export default StudentIcon;
