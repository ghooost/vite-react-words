import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/index";
import {
  prepareSelectedCollectios,
  processAnswer,
  selectCollectionsPreparationState,
  selectQuizData,
} from "@store/collectionsSlice";
import { Home } from "../Home";

export const HomeConnected = function () {
  const dispatch = useAppDispatch();
  const preparationState = useSelector(selectCollectionsPreparationState);
  const quizData = useSelector(selectQuizData);

  useEffect(() => {
    dispatch(prepareSelectedCollectios());
  }, [dispatch]);

  const handleClick = useCallback(
    (answer: string) => {
      dispatch(processAnswer({ quest: quizData?.quest ?? "", answer }));
    },
    [quizData, dispatch]
  );

  return (
    <Home
      preparationState={preparationState}
      data={quizData}
      onClick={handleClick}
    />
  );
};
