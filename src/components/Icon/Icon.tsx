import { useCallback } from "react";
import { ReactComponent as StarIco } from "./assets/star.svg";
import { ReactComponent as ReloadIco } from "./assets/reload.svg";
const ValidIconTypes = {
  star: StarIco,
  reload: ReloadIco,
};

interface IconProps {
  type: keyof typeof ValidIconTypes;
  className?: string;
  onClick?: () => void;
}

export const Icon = function ({ type, className, onClick }: IconProps) {
  const Ico = ValidIconTypes[type];
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);
  return <Ico className={className} onClick={handleClick} />;
};
