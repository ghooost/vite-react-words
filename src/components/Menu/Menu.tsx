import { NavLink } from "react-router-dom";
import { Base } from "@router/contants";

import styles from "./styles.module.css";
import { useI18n } from "../../i18n/useI18n";

const getClassName = ({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) =>
  [
    styles.item,
    isActive ? styles.active : "",
    isPending ? styles.pending : "",
  ].join(" ");

export const Menu = function () {
  const { t } = useI18n();
  return (
    <nav className={styles.root}>
      <NavLink to={Base} end className={getClassName}>
        {t("quiz")}
      </NavLink>
      <NavLink to={`${Base}setup`} className={getClassName}>
        {t("setup")}
      </NavLink>
      <NavLink to={`${Base}about`} className={getClassName}>
        {t("about")}
      </NavLink>
    </nav>
  );
};
