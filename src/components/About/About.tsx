import { useI18n } from "../../i18n/useI18n";
import styles from "./styles.module.css";

export const About = function () {
  const { t } = useI18n();
  return (
    <div className={styles.root}>
      <div
        className={styles.maininfo}
        dangerouslySetInnerHTML={{ __html: t("aboutCustomer") }}
      ></div>
      <div
        className={styles.devinfo}
        dangerouslySetInnerHTML={{ __html: t("aboutDev") }}
      ></div>
    </div>
  );
};
