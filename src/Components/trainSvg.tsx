import React from "react";
import { SVGProps } from "react";
const Train = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    viewBox="0 0 60 60"
    className="Train"
    {...props}
  >
    <path
      d="M7.684 12.483c-1.14 0-2.06.919-2.06 2.06v30.914c0 1.141.92 2.06 2.06 2.06h44.63a2.056 2.056 0 0 0 2.063-2.06V14.543c0-1.141-.92-2.06-2.062-2.06H7.685z"
      style={{
        strokeLinejoin: "round",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeWidth: 10,
        fill: "none",
      }}
    />
    <path
      d="M7.684 12.483c-1.14 0-2.06.919-2.06 2.06v30.914c0 1.141.92 2.06 2.06 2.06h44.63a2.056 2.056 0 0 0 2.063-2.06V14.543c0-1.141-.92-2.06-2.062-2.06H7.685z"
      style={{
        strokeLinejoin: "round",
        fillRule: "evenodd",
        stroke: "#000",
        strokeLinecap: "round",
        strokeWidth: 5,
        fill: "#007500",
      }}
    />
  </svg>
);
export default Train;
