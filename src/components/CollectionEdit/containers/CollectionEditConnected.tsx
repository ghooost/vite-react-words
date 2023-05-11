import {
  loadCollectionData,
  selectCollectionDataById,
  updateCollection,
} from "@store/collectionsSlice";
import { useAppDispatch } from "@store/index";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useLoaderData, useSubmit } from "react-router-dom";
import { CollectionEdit } from "../CollectionEdit";
import { useIsMobile } from "@components/IsMobile/useIsMobile";

export const CollectionEditConnected = function () {
  const dispatch = useAppDispatch();
  const collectionId = useLoaderData() as string;
  const data = useSelector((state) =>
    selectCollectionDataById(state, collectionId)
  );
  const submit = useSubmit();

  const handleReload = useCallback(async () => {
    await dispatch(loadCollectionData(collectionId));
  }, [dispatch, collectionId]);

  const handleDelete = useCallback(() => {
    submit(null, { method: "delete", action: "delete" });
  }, [submit]);

  const handleResetStat = useCallback(() => {
    dispatch(
      updateCollection({ id: collectionId, okAnswers: 0, wrongAnswers: 0 })
    );
  }, [collectionId, dispatch]);

  const isMobile = useIsMobile();
  console.log(isMobile);

  return (
    <CollectionEdit
      data={data}
      isMobile={isMobile}
      onReload={handleReload}
      onDelete={handleDelete}
      onResetStat={handleResetStat}
    />
  );
};
