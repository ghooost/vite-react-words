import { Lang } from "@i18n/index";
import styles from "./styles.module.css";

interface Option {
  value: string;
  label: string;
}

interface Props {
  name?: string;
  id?: string;
  label?: string;
  className?: string;
  defaultValue?: string;
  options?: Option[] | string[];
  onClick?: (value: Lang) => void;
}

export const Radio = function ({
  name,
  id,
  label,
  className,
  defaultValue,
  options,
  onClick,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");

  const inputProps: Record<string, boolean | string> = {};
  if (name !== undefined) {
    inputProps.name = name;
  }
  if (id !== undefined) {
    inputProps.id = id;
  }

  return (
    <div className={rootClass}>
      {label && <span className={styles.label}>{label}:</span>}
      {options?.map((option) => {
        const localValue = typeof option === "string" ? option : option.value;
        const localLabel = typeof option === "string" ? option : option.label;
        return (
          <label className={styles.field} key={`${localLabel}_${localValue}`}>
            <input
              type="radio"
              value={localValue}
              checked={localValue === defaultValue}
              onClick={() => (onClick ? onClick(localValue as Lang) : null)}
              tabIndex={0}
              {...inputProps}
            />
            <span className={styles.itemLabel}>{localLabel}</span>
          </label>
        );
      })}
    </div>
  );
};
