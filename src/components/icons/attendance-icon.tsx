import * as React from "react";

function AttendanceIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width="800px" height="800px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				className="fill-current"
				fillRule="evenodd"
				d="M6.9 0h.2A2.9 2.9 0 0 1 10 2.9v1.2A2.9 2.9 0 0 1 7.1 7h-.2A2.9 2.9 0 0 1 4 4.1V2.9A2.9 2.9 0 0 1 6.9 0z M14.81 4.58l-4.15 5.82c.226.503.341 1.049.34 1.6v4.67A1.336 1.336 0 0 1 9.67 18l-5.34-.01A1.327 1.327 0 0 1 3 16.67V12a4.012 4.012 0 0 1 4-4 3.9 3.9 0 0 1 2.36.79l3.83-5.37a1 1 0 0 1 1.62 1.16z"
			/>
		</svg>
	);
}

export default AttendanceIcon;
