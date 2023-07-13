import React, { useEffect } from "react";
import { NslSvg } from "./nslSvg";

export function MapRenderer(props: {
  setIsRendered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    props.setIsRendered(true);
    return () => props.setIsRendered(false);
  });
  return <NslSvg />;
}
