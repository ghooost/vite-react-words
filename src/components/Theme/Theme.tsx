import { createContext, useEffect, useMemo, useState } from "react";
const localStorageKey = "theme";

type ThemeType = "light" | "dark" | "auto";
const availableThemes: ThemeType[] = ["light", "dark", "auto"];

interface ThemeContextType {
  theme: ThemeType;
  availableThemes: ThemeType[];
  setTheme: (theme: string) => void;
}

const makeContextValue = (
  theme: ThemeContextType["theme"],
  setThemeFunc?: (theme: ThemeType) => unknown,
  useLocalStorage?: boolean
): ThemeContextType => ({
  theme,
  availableThemes,
  setTheme: (maybeTheme: string) => {
    const theme =
      availableThemes.find((theme) => theme === maybeTheme) ?? "auto";
    if (useLocalStorage) {
      localStorage.setItem(localStorageKey, theme);
    }
    if (setThemeFunc) {
      setThemeFunc(theme);
    }
  },
});

export const ThemeContext = createContext<ThemeContextType>(
  makeContextValue("auto")
);

type Props = {
  useLocalStorage?: boolean;
  children: JSX.Element;
};

export const Theme = ({ useLocalStorage, children }: Props) => {
  const [curTheme, setCurTheme] = useState<ThemeType>("auto");

  useEffect(() => {
    if (useLocalStorage) {
      const maybeTheme = localStorage.getItem(localStorageKey);
      const theme = availableThemes.find((theme) => theme === maybeTheme);
      if (theme !== undefined) {
        setCurTheme(theme);
      }
    }
  }, [useLocalStorage]);

  useEffect(() => {
    const root = document?.body as HTMLBodyElement;
    if (root) {
      root.dataset.theme = curTheme ?? "";
    }
  }, [curTheme]);

  const themeValue = useMemo(
    () => makeContextValue(curTheme, setCurTheme, useLocalStorage),
    [curTheme, useLocalStorage]
  );

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};
