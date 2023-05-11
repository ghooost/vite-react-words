import { Collection } from "@store/collectionsSlice";
import { Form, Link } from "react-router-dom";

import { TextInput } from "@components/TextInput";
import { IconCheckbox } from "@components/IconCheckbox";
import { WordsList } from "@components/WordsList";
import { FieldBlock } from "@components/FieldBlock";
import { StatisticField } from "@components/StatisticField";
import { Button } from "@components/Button";

import styles from "./styles.module.css";
import { Base } from "@router/contants";

interface Props {
  data?: Collection;
  isMobile?: boolean;
  onReload: () => void;
  onDelete: () => void;
  onResetStat: () => void;
}

export const CollectionEdit = function ({
  data,
  isMobile,
  onReload,
  onDelete,
  onResetStat,
}: Props) {
  if (data === undefined) {
    return null;
  }

  const numberOfWords = data.words?.length ?? 0;
  const topWords = data.words?.slice(0, 5).map(({ orig }) => orig);
  const collectionId = data.id;

  console.log(isMobile);

  return (
    <div className={styles.root}>
      {isMobile === true && (
        <Link to={`${Base}setup`} className={styles.backLink}>
          List of collections
        </Link>
      )}
      <Form method="post">
        <TextInput
          autofocus
          key={`name${collectionId}`}
          name="name"
          label="Name"
          defaultValue={data?.name}
        />
        <TextInput
          key={`url${collectionId}`}
          name="url"
          label="URL"
          placeholder="Google Sheet or Flickr Photoset"
          defaultValue={data?.url}
        />
        <IconCheckbox
          label="Use in quiz"
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
          errorMessage={data?.errorMessage}
          onClick={onReload}
        />
        <StatisticField
          label="Correct answers"
          linkText="Reset"
          okAnswers={data?.okAnswers}
          wrongAnswers={data?.wrongAnswers}
          onClick={onResetStat}
        />
        <FieldBlock>
          <>
            <Button type="submit">Update</Button>
            <a className={styles.service} onClick={onDelete}>
              Delete
            </a>
          </>
        </FieldBlock>
      </Form>
    </div>
  );
};
