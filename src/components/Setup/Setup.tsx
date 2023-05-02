import { Form, Outlet, useSubmit } from "react-router-dom";
// import { Menu } from "components/Menu";

import styles from "./styles.module.css";
import { CollectionList } from "@components/CollectionList";
import { useCallback } from "react";
// import { useCallback } from "react";
// import { useAppDispatch } from "@store/index";

export const Setup = function () {
  // const dispatch = useAppDispatch();
  // const handleClick = useCallback(() => {
  //   dispatch();
  // }, [dispatch]);
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
