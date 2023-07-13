import React, { useEffect } from "react";
import { NslSvgV2 } from "./nslSvgV2";

export function MapRenderer(props: {
  setIsRendered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    props.setIsRendered(true);
    return () => props.setIsRendered(false);
  });
  return <NslSvgV2 />;
}
