import { Outlet } from "react-router-dom";
import { CollectionList } from "@components/CollectionList";
import { useIsMobile } from "@components/IsMobile/useIsMobile";

import styles from "./styles.module.css";

export const Setup = function () {
  const isMobile = useIsMobile();

  return (
    <div className={styles.root}>
      {isMobile === false && (
        <div className={styles.menu}>
          <CollectionList />
        </div>
      )}
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};
