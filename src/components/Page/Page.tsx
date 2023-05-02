import { Outlet } from "react-router-dom";
import { Menu } from "@components/Menu";
import { useSelector } from "react-redux";

import styles from "./styles.module.css";
import { selectCollectionsState } from "@store/collectionsSlice";

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
