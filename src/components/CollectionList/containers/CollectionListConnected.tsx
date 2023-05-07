import { useSubmit } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectAllCollections } from "@store/collectionsSlice";
import { useCallback } from "react";
import { CollectionList } from "../CollectionList";

export const CollectionListConnected = function () {
  const collections = useSelector(selectAllCollections);
  const submit = useSubmit();
  const handleCreate = useCallback(() => {
    submit(null, { method: "post", action: "create" });
  }, [submit]);

  return <CollectionList collections={collections} onCreate={handleCreate} />;
};
