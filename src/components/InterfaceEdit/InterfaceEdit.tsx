import { Link } from "react-router-dom";

import styles from "./styles.module.css";
import { Base } from "@router/contants";
import { Radio } from "@components/Radio";
// import { Lang } from "@i18n/index";
import { useI18n } from "@i18n/useI18n";

interface Props {
  isMobile?: boolean;
  // onChangeLanguage: (lang: Lang) => void;
}

export const InterfaceEdit = function ({ isMobile }: Props) {
  const { t, lang, availableLangs, setLang } = useI18n();

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
    </div>
  );
};
