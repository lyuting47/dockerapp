import { useLayoutEffect, useState } from "react";

// Hook to rerender animations properly when window is resized
// Written by Sophie Alpert and Matt Fletcher on https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
export function useWindowSizeListener() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
