import { NavLink } from "react-router-dom";

import styles from "./styles.module.css";

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
  return (
    <nav className={styles.root}>
      <NavLink to={`/`} className={getClassName}>
        Home
      </NavLink>
      <NavLink to={`/setup`} className={getClassName}>
        Setup
      </NavLink>
    </nav>
  );
};
