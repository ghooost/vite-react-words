import { useMemo } from "react";
import styles from "./styles.module.css";

interface Props {
  label?: string;
  linkText?: string;
  className?: string;
  words?: string[];
  totalNum: number;
  isLoading: boolean;
  onClick?: () => void;
}

export const WordsList = function ({
  label,
  className,
  linkText,
  words,
  totalNum,
  isLoading,
  onClick,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");
  const message = useMemo(() => {
    if (isLoading) {
      return "...";
    }
    const _words = words ?? [];
    const _totalNum = totalNum ?? 0;
    if (_words.length === 0) {
      return "--";
    }
    if (_words.length < _totalNum) {
      return `${_words.join(", ")}... (${_totalNum})`;
    }
    return _words.join(", ");
  }, [isLoading, totalNum, words]);

  return (
    <label className={rootClass}>
      {label && <span className={styles.label}>{label}:</span>}
      <span className={styles.field}>
        {message}
        {onClick && linkText && !isLoading && (
          <a className={styles.link} onClick={onClick}>
            {linkText}
          </a>
        )}
      </span>
    </label>
  );
};
