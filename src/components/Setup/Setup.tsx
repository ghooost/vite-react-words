import { useCallback } from "react";
import { Outlet, useSubmit } from "react-router-dom";
import { CollectionList } from "@components/CollectionList";

import styles from "./styles.module.css";

export const Setup = function () {
  return (
    <div className={styles.root}>
      <div className={styles.menu}>
        <CollectionList />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};
