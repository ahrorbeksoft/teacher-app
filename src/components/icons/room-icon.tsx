import * as React from "react";

function RoomIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg width="800px" height="800px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				className="fill-current"
				d="M440,424V88H352V13.005L88,58.522V424H16v32h86.9L352,490.358V120h56V456h88V424ZM320,453.642,120,426.056V85.478L320,51Z"
			/>
			<rect width="32" height="64" x="256" y="232" className="fill-current" />
		</svg>
	);
}

export default RoomIcon;
