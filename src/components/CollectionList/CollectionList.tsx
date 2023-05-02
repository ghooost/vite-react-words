import { NavLink } from "react-router-dom";

import styles from "./styles.module.css";
import { useSelector } from "react-redux";
import { selectAllCollections } from "@store/collectionsSelectors";

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

export const CollectionList = function () {
  const collections = useSelector(selectAllCollections);

  return (
    <nav className={styles.root}>
      {collections.map(({ id, name }) => (
        <NavLink key={id} to={id} className={getClassName}>
          {name || "No name"}
        </NavLink>
      ))}
    </nav>
  );
};
