import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./styles.module.css";

type Props = {
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: JSX.Element | string;
  onClick?: () => void;
};

export const Button = function ({ type, className, children, onClick }: Props) {
  const rootClass = [styles.root, className ?? ""].join(" ");
  const props: DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > = {};
  if (type) {
    props.type = type;
  }
  if (onClick) {
    props.onClick = onClick;
  }
  return (
    <button className={rootClass} {...props}>
      {children}
    </button>
  );
};
