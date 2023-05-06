import styles from "./styles.module.css";

interface Props {
  name?: string;
  id?: string;
  label?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const TextInput = function ({
  name,
  id,
  label,
  className,
  defaultValue,
  value,
  onChange,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");

  const inputProps: Record<string, string | typeof onChange> = {};
  if (name !== undefined) {
    inputProps.name = name;
  }
  if (id !== undefined) {
    inputProps.id = id;
  }
  if (defaultValue !== undefined) {
    inputProps.defaultValue = defaultValue;
  }
  if (value !== undefined) {
    inputProps.value = value;
  }
  if (onChange !== undefined) {
    inputProps.onChange = onChange;
  }

  return (
    <label className={rootClass}>
      {label && <span className={styles.label}>{label}:</span>}
      <span className={styles.field}>
        <input type="text" className={styles.input} {...inputProps} />
      </span>
    </label>
  );
};
