import { Link } from "react-router-dom";

import styles from "./styles.module.css";
import { Base } from "@router/contants";
import { Radio } from "@components/Radio";
import { useI18n } from "@i18n/useI18n";
import { useTheme } from "@components/Theme/useTheme";

interface Props {
  isMobile?: boolean;
}

export const InterfaceEdit = function ({ isMobile }: Props) {
  const { t, lang, availableLangs, setLang } = useI18n();
  const { theme, availableThemes, setTheme } = useTheme();
  return (
    <div className={styles.root}>
      {isMobile === true && (
        <Link to={`${Base}setup`} className={styles.backLink}>
          {t("listOfCollections")}
        </Link>
      )}
      <Radio
        name="lang"
        label={t("language")}
        options={availableLangs}
        defaultValue={lang}
        onClick={setLang}
      />
      <Radio
        name="theme"
        label={t("theme")}
        options={availableThemes}
        defaultValue={theme}
        onClick={setTheme}
      />
    </div>
  );
};
