import { NavLink, useSubmit } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectAllCollections } from "@store/collectionsSlice";
import { Icon } from "@components/Icon";
import { useCallback } from "react";

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

export const CollectionList = function () {
  const collections = useSelector(selectAllCollections);
  const submit = useSubmit();
  const handleCreate = useCallback(() => {
    submit(null, { method: "post", action: "create" });
  }, [submit]);

  return (
    <nav className={styles.root}>
      <div className={styles.servicePanel}>
        <a className={styles.service} onClick={handleCreate}>
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
