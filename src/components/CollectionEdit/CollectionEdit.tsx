// import { Menu } from "components/Menu";

import {
  loadCollectionData,
  selectCollectionDataById,
} from "@store/collectionsSlice";
import { useAppDispatch } from "@store/index";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Form, useLoaderData, useSubmit } from "react-router-dom";
import styles from "./styles.module.css";

export const CollectionEdit = function () {
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

  const numberOfWords = data?.words?.length ?? 0;
  const topWords = data?.words
    ?.slice(0, 5)
    .map(({ orig }) => orig)
    .join(", ");

  return (
    <div className={styles.root}>
      <Form method="post">
        <label className={styles.field}>
          <div className={styles.label}>Name</div>
          <input
            className={styles.input}
            key={`name${collectionId}`}
            name="name"
            type="text"
            defaultValue={data?.name}
          />
        </label>
        <label className={styles.field}>
          <div className={styles.label}>Sheet Id</div>
          <input
            className={styles.input}
            key={`sheetId${collectionId}`}
            name="sheetId"
            type="text"
            defaultValue={data?.sheetId}
          />
        </label>
        <label className={styles.field}>
          <div className={styles.label}>Selected</div>
          <input
            key={`isSelected${collectionId}`}
            name="isSelected"
            type="checkbox"
            value="1"
            defaultChecked={data?.isSelected}
          />
        </label>
        <label className={styles.field}>
          <div className={styles.label}>Words</div>
          {data?.state === "ready" && numberOfWords > 5 && (
            <div className={styles.subfield}>
              {`${topWords}... (${numberOfWords} words loaded)`}
            </div>
          )}
          {data?.state === "ready" &&
            numberOfWords < 5 &&
            numberOfWords > 0 && (
              <div className={styles.subfield}>
                {`${topWords} (${numberOfWords} words loaded)`}
              </div>
            )}
          {data?.state === "ready" && numberOfWords === 0 && (
            <div className={styles.subfield}>No words loaded</div>
          )}
          {data?.state === "loading" && (
            <div className={styles.subfield}>Loading...</div>
          )}
          {data?.state !== "loading" && (
            <div className={styles.subfield}>
              <a className={styles.service} onClick={handleReload}>
                Reload
              </a>
            </div>
          )}
        </label>
        <div className={styles.field}>
          <button className={styles.service} type="submit">
            Update
          </button>
          <a className={styles.service} onClick={handleDelete}>
            Delete
          </a>
        </div>
      </Form>
    </div>
  );
};
