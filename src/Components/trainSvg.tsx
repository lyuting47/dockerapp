import React from "react";
import { SVGProps } from "react";

export const TrainSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={18}
    viewBox="0 0 480 270"
    className="Train"
    {...props}
  >
    <path fill="none" stroke="#000" strokeWidth={7} d="M0 0h480v270H0z" />
  </svg>
);

export const trainWidth = 32;
export const trainHeight = 18;
