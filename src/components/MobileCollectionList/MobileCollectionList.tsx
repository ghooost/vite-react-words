import { CollectionList } from "@components/CollectionList";
import { useIsMobile } from "@components/IsMobile/useIsMobile";

import styles from "./styles.module.css";

export const MobileCollectionList = function () {
  const isMobile = useIsMobile();

  if (isMobile !== true) {
    return null;
  }

  return (
    <div className={styles.root}>
      <CollectionList />
    </div>
  );
};
