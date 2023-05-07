import { useContext } from "react";
import { IsMobileContext } from "./IsMobile";

export const useIsMobile = () => {
  return useContext(IsMobileContext);
};
