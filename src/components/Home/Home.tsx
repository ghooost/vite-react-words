import {
  selectCollectionsPreparationState,
  selectQuizData,
} from "@store/collectionsSelectors";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/index";
import { prepareSelectedCollectios, updateQuiz } from "@store/collectionsSlice";

import styles from "./styles.module.css";

export const Home = function () {
  const dispatch = useAppDispatch();
  const preparationState = useSelector(selectCollectionsPreparationState);
  const quizData = useSelector(selectQuizData);

  useEffect(() => {
    dispatch(prepareSelectedCollectios());
  }, [dispatch]);

  const handleClick = useCallback(
    (word: string) => {
      if (word === quizData?.answer) {
        dispatch(updateQuiz());
      }
    },
    [quizData, dispatch]
  );

  if (preparationState !== "ready") {
    return null;
  }

  if (quizData === null) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.quest}>{quizData.quest}</div>
      <div className={styles.answers}>
        {quizData.fakes.map((word) => (
          <a
            key={word}
            className={styles.answer}
            onClick={() => handleClick(word)}
          >
            {word}
          </a>
        ))}
      </div>
    </div>
  );
};
