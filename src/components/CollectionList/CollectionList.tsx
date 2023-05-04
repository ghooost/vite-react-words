import { NavLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectAllCollections } from "@store/collectionsSlice";

import styles from "./styles.module.css";
import { Icon } from "@components/Icon";

const getClassName =
  (isSelected: boolean) =>
  ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
    [
      styles.item,
      isActive ? styles.active : "",
      isPending ? styles.pending : "",
      isSelected ? styles.selected : "",
    ].join(" ");

export const CollectionList = function () {
  const collections = useSelector(selectAllCollections);

  return (
    <nav className={styles.root}>
      {collections.map(({ id, name, isSelected }) => (
        <NavLink key={id} to={id} className={getClassName(isSelected)}>
          <Icon type="star" className={styles.ico} />
          <span className={styles.name}>{name || "No name"}</span>
        </NavLink>
      ))}
    </nav>
  );
};
