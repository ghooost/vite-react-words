import { useContext } from "react";
import { I18nContext } from ".";

export const useI18n = () => {
  return useContext(I18nContext);
};
