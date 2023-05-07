import { Menu } from "@components/Menu";
import { Collection } from "@store/collectionsSlice";
import styles from "./styles.module.css";

interface Props {
  loadingState: Collection["state"];
  children: JSX.Element | string;
}

export const Page = function ({ loadingState, children }: Props) {
  if (loadingState !== "ready") {
    return <div className={styles.loader}></div>;
  }

  return (
    <>
      <header className={styles.header}>
        <Menu />
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};
