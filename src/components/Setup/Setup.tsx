import { Form, Outlet } from "react-router-dom";
// import { Menu } from "components/Menu";

import styles from "./styles.module.css";
import { CollectionList } from "@components/CollectionList";
// import { useCallback } from "react";
// import { useAppDispatch } from "@store/index";

export const Setup = function () {
  // const dispatch = useAppDispatch();
  // const handleClick = useCallback(() => {
  //   dispatch();
  // }, [dispatch]);
  return (
    <div className={styles.root}>
      <div className={styles.menu}>
        <Form method="post">
          <button type="submit">Create new</button>
        </Form>
        <CollectionList />
      </div>
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};
