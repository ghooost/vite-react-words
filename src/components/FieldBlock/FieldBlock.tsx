import styles from "./styles.module.css";

export const FieldBlock = function ({ children }: { children?: JSX.Element }) {
  return <div className={styles.root}>{children}</div>;
};
