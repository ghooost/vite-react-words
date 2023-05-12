import { useContext } from "react";
import { ThemeContext } from "./Theme";

export const useTheme = () => {
  return useContext(ThemeContext);
};
