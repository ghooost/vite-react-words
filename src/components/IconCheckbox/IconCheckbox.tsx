import { Icon, IconProps } from "@components/Icon";
import styles from "./styles.module.css";

interface Props {
  name?: string;
  id?: string;
  ico: IconProps["type"];
  label?: string;
  className?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  value?: string;
  onChange?: (isChecked: boolean) => void;
}

export const IconCheckbox = function ({
  name,
  id,
  ico,
  label,
  className,
  defaultChecked,
  checked,
  value,
  onChange,
}: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");

  const inputProps: Record<string, boolean | string | typeof onChange> = {};
  if (name !== undefined) {
    inputProps.name = name;
  }
  // if (key !== undefined) {
  //   inputProps.key = key;
  // }
  if (id !== undefined) {
    inputProps.id = id;
  }
  if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }
  if (checked !== undefined) {
    inputProps.checked = checked;
  }
  if (value !== undefined) {
    inputProps.checked = value;
  }
  if (onChange !== undefined) {
    inputProps.onChange = onChange;
  }

  return (
    <label className={rootClass}>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.field}>
        <input
          type="checkbox"
          {...inputProps}
          className={styles.hiddenCheckbox}
        />
        <Icon type={ico} className={styles.icon}></Icon>
      </span>
    </label>
  );
};
