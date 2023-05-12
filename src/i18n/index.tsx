import { createContext, useEffect, useMemo, useState } from "react";
import { config } from "./config";

const defaultLocale: Lang = "en";
const localStorageKey = "i18n";

type Config = typeof config;
export type Lang = keyof Config["locales"];
type MessageKey =
  keyof (typeof config)["locales"][typeof defaultLocale]["messages"];

interface I18nContextType {
  lang: Lang;
  availableLangs: Lang[];
  t: (key: MessageKey) => string;
  setLang: (lang: Lang) => void;
}

type Props = {
  lang?: Lang;
  useLocalStorage?: boolean;
  children: JSX.Element;
};

export const I18nContext = createContext<I18nContextType>({
  lang: defaultLocale,
  availableLangs: Object.keys(config.locales) as Lang[],
  t: () => "",
  setLang: () => {
    //
  },
});

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
    () => ({
      lang: curLang,
      availableLangs: Object.keys(config.locales) as Lang[],
      t: (key: MessageKey) => {
        const curMessages = config.locales[curLang].messages;
        if (curMessages[key]) {
          return curMessages[key];
        }
        const defMessages = config.locales[defaultLocale].messages;
        if (defMessages[key]) {
          return defMessages[key];
        }
        return key;
      },
      setLang: (lang: Lang) => {
        if (useLocalStorage) {
          localStorage.setItem(localStorageKey, lang);
        }
        setCurLang(lang);
      },
    }),
    [curLang, useLocalStorage]
  );
  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};
