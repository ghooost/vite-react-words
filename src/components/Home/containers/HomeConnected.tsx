import { useCallback, useEffect, useState } from "react";
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
  const [wrongTarget, setWrongTarget] = useState<EventTarget | null>(null);

  useEffect(() => {
    dispatch(prepareSelectedCollectios());
  }, [dispatch]);

  useEffect(() => {
    if (wrongTarget === null) {
      return;
    }
    setWrongTarget(null);
    const link = wrongTarget as HTMLAnchorElement;
    link.dataset.wrong = "yes";
    setTimeout(() => {
      delete link.dataset.wrong;
    }, 300);
  }, [wrongTarget]);

  const handleClick = useCallback(
    async (answer: string, target: EventTarget) => {
      const { payload } = await dispatch(
        processAnswer({ quest: quizData?.quest ?? "", answer })
      );
      setWrongTarget(payload ? null : target);
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
