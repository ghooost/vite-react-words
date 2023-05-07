import { NavLink } from "react-router-dom";

import { Collection } from "@store/collectionsSlice";
import { Icon } from "@components/Icon";

import styles from "./styles.module.css";

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
  return (
    <nav className={styles.root}>
      <div className={styles.servicePanel}>
        <a className={styles.service} onClick={onCreate}>
          New connection
        </a>
      </div>
      {collections.map(({ id, name, isSelected }) => (
        <NavLink key={id} to={id} className={getClassName(isSelected)}>
          <Icon type="star" className={styles.ico} />
          <span className={styles.name}>{name || "No name"}</span>
        </NavLink>
      ))}
    </nav>
  );
};
