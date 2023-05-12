// import { updateCollection } from "@store/collectionsSlice";
// import { useAppDispatch } from "@store/index";
// import { useCallback } from "react";
// import { useSelector } from "react-redux";
// import { useLoaderData, useSubmit } from "react-router-dom";
// import { CollectionEdit } from "../CollectionEdit";
import { useIsMobile } from "@components/IsMobile/useIsMobile";
import { InterfaceEdit } from "../InterfaceEdit";

export const InterfaceEditConnected = function () {
  const isMobile = useIsMobile();

  return <InterfaceEdit isMobile={isMobile} />;
};
