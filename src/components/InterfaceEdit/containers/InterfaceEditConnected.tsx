// import { updateCollection } from "@store/collectionsSlice";
import { useIsMobile } from "@components/IsMobile/useIsMobile";
import { InterfaceEdit } from "../InterfaceEdit";

export const InterfaceEditConnected = function () {
  const isMobile = useIsMobile();
  console.log("isMobile", isMobile);
  return <InterfaceEdit isMobile={isMobile} />;
};
