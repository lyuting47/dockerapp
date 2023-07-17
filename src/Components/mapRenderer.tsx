import React, { SVGProps, useEffect } from "react";

// Renderer to ensure map is completely rendered before attempting to render trains
export function MapRenderer(props: {
  setIsRendered: React.Dispatch<React.SetStateAction<boolean>>;
  mapSvg: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) {
  useEffect(() => {
    props.setIsRendered(true);
    return () => props.setIsRendered(false);
  });
  return props.mapSvg({});
}
