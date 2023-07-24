import { useEffect } from "react";

export function useVisibilityListener() {
  const visibilityListener = () => {
    if (document.visibilityState === "hidden") {
      const animations = document.getAnimations();
      for (let i = 0; i < animations.length; i++) {
        const animation = animations[i];
        animation.cancel();
      }
    }
  };
  useEffect(() => {
    document.addEventListener("visibilitychange", visibilityListener);
    return () => {
      document.removeEventListener("visibilitychange", visibilityListener);
    };
  }, []);
}
