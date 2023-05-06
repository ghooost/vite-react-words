import { CollectionList } from "@components/CollectionList";
import styles from "./styles.module.css";

export const MobileCollectionList = function () {
  return (
    <div className={styles.root}>
      <CollectionList />
    </div>
  );
};
