import { createContext, useEffect, useMemo, useState } from "react";
import { config } from "./config";

const defaultLocale: Lang = "en";
const availableLangs = Object.keys(config.locales) as Lang[];
const localStorageKey = "i18n";

type Config = typeof config;
export type Lang = keyof Config["locales"];
type MessageKey =
  keyof (typeof config)["locales"][typeof defaultLocale]["messages"];

interface I18nContextType {
  lang: Lang;
  availableLangs: Lang[];
  t: (key: MessageKey) => string;
  setLang: (lang: string) => void;
}

type Props = {
  lang?: Lang;
  useLocalStorage?: boolean;
  children: JSX.Element;
};

const makeContextValue = (
  lang: Lang,
  defLang: Lang,
  setLangFunc?: (lang: Lang) => unknown,
  useLocalStorage?: boolean
): I18nContextType => ({
  lang,
  availableLangs,
  t: (key) => {
    const curMessages = config.locales[lang].messages;
    if (curMessages[key]) {
      return curMessages[key];
    }
    const defMessages = config.locales[defLang].messages;
    if (defMessages[key]) {
      return defMessages[key];
    }
    return key;
  },
  setLang: (maybeLang: string) => {
    const lng = availableLangs.find((lang) => lang === maybeLang) ?? defLang;
    if (useLocalStorage) {
      localStorage.setItem(localStorageKey, lng);
    }
    if (setLangFunc) {
      setLangFunc(lng);
    }
  },
});

export const I18nContext = createContext<I18nContextType>(
  makeContextValue(defaultLocale, defaultLocale)
);

export const I18n = ({ useLocalStorage, lang, children }: Props) => {
  const [curLang, setCurLang] = useState<Lang>(lang ?? defaultLocale);
  useEffect(() => {
    if (useLocalStorage) {
      const newLang = localStorage.getItem(localStorageKey) ?? defaultLocale;
      if (Object.keys(config.locales).includes(newLang)) {
        setCurLang(newLang as Lang);
      }
    }
  }, [useLocalStorage]);

  const contextValue = useMemo<I18nContextType>(
    () =>
      makeContextValue(
        curLang,
        lang ?? defaultLocale,
        setCurLang,
        useLocalStorage
      ),
    [curLang, lang, useLocalStorage]
  );
  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};
