import { ReactComponent as StarIco } from "./assets/star.svg";
import { ReactComponent as ReloadIco } from "./assets/reload.svg";
const ValidIconTypes = {
  star: StarIco,
  reload: ReloadIco,
};

export interface IconProps {
  type: keyof typeof ValidIconTypes;
  isEmpty?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Icon = function ({
  type,
  isEmpty,
  className,
  onClick,
}: IconProps) {
  const Ico = ValidIconTypes[type];
  const props: Record<string, boolean | string | typeof onClick> = {};
  const styles = { fill: isEmpty ? "currentColor" : "" };
  if (className !== undefined) {
    props.className = className;
  }
  if (onClick !== undefined) {
    props.onClick = onClick;
  }
  return <Ico {...props} style={styles} />;
};
