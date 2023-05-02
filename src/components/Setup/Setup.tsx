import { useCallback } from "react";
import { Outlet, useSubmit } from "react-router-dom";
import { CollectionList } from "@components/CollectionList";

import styles from "./styles.module.css";

export const Setup = function () {
  const submit = useSubmit();
  const handleCreate = useCallback(() => {
    submit(null, { method: "post" });
  }, [submit]);

  return (
    <div className={styles.root}>
      <div className={styles.menu}>
        <div className={styles.serviceHolder}>
          <a className={styles.service} onClick={handleCreate}>
            New collection
          </a>
        </div>
        <CollectionList />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};
