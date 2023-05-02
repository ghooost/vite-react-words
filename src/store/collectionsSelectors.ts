import { createSelector } from "@reduxjs/toolkit";
import { RootState } from ".";

export const selectCollections = (state: RootState) => state.collections;

export const selectCollectionsState = createSelector(
  selectCollections,
  (state) => state.state
);

export const selectAllCollections = createSelector(
  selectCollections,
  (state) => state.collections
);

export const selectSelectedCollections = createSelector(
  selectAllCollections,
  (collections) => collections.filter(({ isSelected }) => isSelected)
);

export const selectCollectionsPreparationState = createSelector(
  selectCollections,
  (state) => state.preparationState
);

interface QuizData {
  quest: string;
  answer: string;
  fakes: string[];
}

export const selectQuizData = createSelector(
  selectCollections,
  ({ preparationState, cachedWords, cachedIndexes }) => {
    if (preparationState !== "ready") {
      return null;
    }

    if (cachedIndexes.length === 0) {
      return null;
    }

    if (cachedWords.length === 0) {
      return null;
    }

    const showIndex = cachedIndexes[0];
    const fakeOptions = [showIndex];

    while (fakeOptions.length < 5 && fakeOptions.length < cachedWords.length) {
      const index = Math.floor(Math.random() * cachedWords.length);
      if (!fakeOptions.includes(index)) {
        fakeOptions.push(index);
      }
    }

    const ret: QuizData = {
      quest: cachedWords[showIndex].orig,
      answer: cachedWords[showIndex].translation,
      fakes: fakeOptions.map((index) => cachedWords[index].translation),
    };

    return ret;
  }
);
