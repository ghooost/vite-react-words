import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectCollectionsState } from "@store/collectionsSlice";
import { Page } from "../Page";

export const PageConnected = function () {
  const loadingState = useSelector(selectCollectionsState);
  return (
    <Page loadingState={loadingState}>
      <Outlet />
    </Page>
  );
};
