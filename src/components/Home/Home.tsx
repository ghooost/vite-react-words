import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/index";
import {
  prepareSelectedCollectios,
  processAnswer,
  selectCollectionsPreparationState,
  selectQuizData,
} from "@store/collectionsSlice";

import styles from "./styles.module.css";

export const Home = function () {
  const dispatch = useAppDispatch();
  const preparationState = useSelector(selectCollectionsPreparationState);
  const quizData = useSelector(selectQuizData);

  useEffect(() => {
    dispatch(prepareSelectedCollectios());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (answer: string) => {
      dispatch(processAnswer({ quest: quizData?.quest ?? "", answer }));
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
