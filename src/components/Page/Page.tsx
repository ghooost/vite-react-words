import { Outlet } from "react-router-dom";
import { Menu } from "@components/Menu";
import { useSelector } from "react-redux";
import { selectCollectionsState } from "@store/collectionsSelectors";

import styles from "./styles.module.css";

export const Page = function () {
  const loadingState = useSelector(selectCollectionsState);
  if (loadingState !== "ready") {
    return <div className={styles.loader}></div>;
  }

  return (
    <>
      <header className={styles.header}>
        <Menu />
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
