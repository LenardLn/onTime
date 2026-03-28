import type { Theme } from "@/entities/theme";

export const themedSvg = (theme: Theme) => {
  return theme === "light"
    ? "brightness-0 saturate-100"
    : "invert brightness-0 saturate-100";
};
