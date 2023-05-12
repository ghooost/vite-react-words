import { NavLink } from "react-router-dom";

import { Collection } from "@store/collectionsSlice";
import { Icon } from "@components/Icon";

import styles from "./styles.module.css";
import { useI18n } from "../../i18n/useI18n";

const getClassName =
  (isSelected: boolean) =>
  ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
    [
      styles.item,
      isActive ? styles.active : "",
      isPending ? styles.pending : "",
      isSelected ? styles.selected : "",
    ].join(" ");

interface Props {
  collections: Collection[];
  onCreate: () => void;
}

export const CollectionList = function ({ collections, onCreate }: Props) {
  const { t } = useI18n();
  return (
    <nav className={styles.root}>
      <NavLink to={`interface`} className={getClassName(false)}>
        {t("interface")}
      </NavLink>
      <a className={styles.service} onClick={onCreate}>
        {t("new")}
      </a>
      {collections.map(({ id, name, isSelected }) => (
        <NavLink key={id} to={id} className={getClassName(isSelected)}>
          <span className={styles.name}>{name || t("noName")}</span>
          <Icon type="star" className={styles.ico} />
        </NavLink>
      ))}
    </nav>
  );
};
