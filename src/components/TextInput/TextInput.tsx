import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import styles from "./styles.module.css";

interface Props {
  name?: string;
  id?: string;
  label?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  autofocus?: boolean;
  onChange?: (value: string) => void;
}

export const TextInput = function ({
  name,
  id,
  label,
  className,
  defaultValue,
  value,
  autofocus,
  onChange,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");

  const inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > = {};

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
    inputProps.onChange = (event: ChangeEvent) =>
      onChange(event.target.textContent ?? "");
  }

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autofocus) {
      ref.current?.focus();
    }
  }, [autofocus]);

  return (
    <label className={rootClass}>
      {label && <span className={styles.label}>{label}:</span>}
      <span className={styles.field}>
        <input type="text" ref={ref} className={styles.input} {...inputProps} />
      </span>
    </label>
  );
};
