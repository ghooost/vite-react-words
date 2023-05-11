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
      <a className={styles.service} onClick={onCreate}>
        New connection
      </a>
      {collections.map(({ id, name, isSelected }) => (
        <NavLink key={id} to={id} className={getClassName(isSelected)}>
          <span className={styles.name}>{name || "No name"}</span>
          <Icon type="star" className={styles.ico} />
        </NavLink>
      ))}
    </nav>
  );
};
