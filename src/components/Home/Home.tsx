import { QuizData, Collection } from "@store/collectionsSlice";

import styles from "./styles.module.css";

interface Props {
  preparationState: Collection["state"];
  data: QuizData | null;
  onClick: (word: string) => void;
}

export const Home = function ({ preparationState, data, onClick }: Props) {
  if (preparationState !== "ready") {
    return null;
  }

  if (data === null) {
    return null;
  }

  const { quest, fakes, type, url } = data;

  return (
    <div className={styles.root}>
      <div className={styles.quest}>
        {type === "word" && quest}
        {type === "image" && <img src={url} className={styles.image} />}
      </div>
      <div className={styles.answers}>
        {fakes.map((word) => (
          <a key={word} className={styles.answer} onClick={() => onClick(word)}>
            {word}
          </a>
        ))}
      </div>
    </div>
  );
};
