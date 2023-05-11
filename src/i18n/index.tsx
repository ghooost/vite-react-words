import { createContext, useMemo, useState } from "react";
import { config } from "./config";

const defaultLocale: Lang = "ru";

type Config = typeof config;
type Lang = keyof Config["locales"];
type MessageKey =
  keyof (typeof config)["locales"][typeof defaultLocale]["messages"];

interface I18nContextType {
  lang: Lang;
  t: (key: MessageKey) => string;
  setLang: (lang: Lang) => void;
}

type Props = {
  children: JSX.Element;
};

export const I18nContext = createContext<I18nContextType>({
  lang: defaultLocale,
  t: () => "",
  setLang: () => {
    //
  },
});

export const I18n = ({ children }: Props) => {
  const [curLang, setCurLang] = useState<Lang>(defaultLocale);

  const contextValue = useMemo<I18nContextType>(
    () => ({
      lang: curLang,
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
      setLang: (lang: Lang) => setCurLang(lang),
    }),
    [curLang, setCurLang]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};
