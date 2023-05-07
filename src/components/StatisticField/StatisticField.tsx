import { useMemo } from "react";
import styles from "./styles.module.css";

interface Props {
  label?: string;
  linkText?: string;
  className?: string;
  okAnswers?: number;
  wrongAnswers?: number;
  onClick?: () => void;
}

export const StatisticField = function ({
  label,
  className,
  linkText,
  okAnswers,
  wrongAnswers,
  onClick,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");
  const message = useMemo(() => {
    if (okAnswers === undefined || wrongAnswers === undefined) {
      return "no statistic";
    }
    return `${((okAnswers / (okAnswers + wrongAnswers)) * 100).toFixed(1)}%`;
  }, [okAnswers, wrongAnswers]);

  return (
    <label className={rootClass}>
      {label && <span className={styles.label}>{label}:</span>}
      <span className={styles.field}>
        {message}
        {onClick &&
          linkText &&
          okAnswers !== undefined &&
          wrongAnswers !== undefined && (
            <a className={styles.link} onClick={onClick}>
              {linkText}
            </a>
          )}
      </span>
    </label>
  );
};
