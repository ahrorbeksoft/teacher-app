import { cn } from "@/lib/utils";
import * as React from "react";

function LeadsIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn("fill-current", className)}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      id="campaign"
      {...props}
    >
      <path d="M22,4.28V15.72a2,2,0,0,1-.77,1.58,2.05,2.05,0,0,1-1.23.42,2,2,0,0,1-.48-.06L10,15.28,8.88,15H7a5,5,0,0,1-3.5-1.43A5,5,0,0,1,7,5H8.88L19.52,2.34a2,2,0,0,1,1.71.36A2,2,0,0,1,22,4.28Z"></path>
      <path d="M10,16.31V20a2,2,0,0,1-2,2H6.82a2,2,0,0,1-2-1.61L3.8,15.08a5.68,5.68,0,0,0,1.74.74A5.9,5.9,0,0,0,7,16H8.76Z"></path>
    </svg>
  );
}

export default LeadsIcon;
