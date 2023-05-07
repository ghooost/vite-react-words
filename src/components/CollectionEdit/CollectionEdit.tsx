// import { Menu } from "components/Menu";

import {
  loadCollectionData,
  selectCollectionDataById,
  updateCollection,
} from "@store/collectionsSlice";
import { useAppDispatch } from "@store/index";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Form, useLoaderData, useSubmit } from "react-router-dom";
import styles from "./styles.module.css";

import { TextInput } from "@components/TextInput";
import { IconCheckbox } from "@components/IconCheckbox";
import { WordsList } from "@components/WordsList";
import { FieldBlock } from "@components/FieldBlock";
import { StatisticField } from "@components/StatisticField";
import { Button } from "@components/Button";

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
  const topWords = data?.words?.slice(0, 5).map(({ orig }) => orig);

  const handleResetStat = useCallback(() => {
    dispatch(
      updateCollection({ id: collectionId, okAnswers: 0, wrongAnswers: 0 })
    );
  }, [collectionId, dispatch]);
  return (
    <div className={styles.root}>
      <Form method="post">
        <TextInput
          autofocus
          key={`name${collectionId}`}
          name="name"
          label="Name"
          defaultValue={data?.name}
        />
        <TextInput
          key={`sheetId${collectionId}`}
          name="sheetId"
          label="Sheet Id"
          defaultValue={data?.sheetId}
        />
        <IconCheckbox
          label="Use in quiz"
          ico="star"
          name="isSelected"
          key={`isSelected${collectionId}`}
          defaultChecked={data?.isSelected}
        />
        <WordsList
          label="Words"
          linkText="Reload"
          totalNum={numberOfWords}
          words={topWords}
          isLoading={data?.state === "loading"}
          onClick={handleReload}
        />
        <StatisticField
          label="Correct answers"
          linkText="Reset"
          okAnswers={data?.okAnswers}
          wrongAnswers={data?.wrongAnswers}
          onClick={handleResetStat}
        />
        <FieldBlock>
          <>
            <Button type="submit">Update</Button>
            <a className={styles.service} onClick={handleDelete}>
              Delete
            </a>
          </>
        </FieldBlock>
      </Form>
    </div>
  );
};
