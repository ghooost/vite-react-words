import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  TranslatedPair,
  loadTranslatedPairsFromGoogleSheet,
} from "@api/googleSheet";

type State = "empty" | "loading" | "saving" | "ready";

export interface Collection {
  id: string;
  isSelected: boolean;
  sheetId: string;
  state: State;
  name: string;
  words?: TranslatedPair[];
}

export interface CollectionsState {
  state: State;
  preparationState: State;
  collections: Collection[];
  cachedWords: TranslatedPair[];
  cachedIndexes: number[];
}

const initialState: CollectionsState = {
  state: "empty",
  preparationState: "empty",
  collections: [],
  cachedWords: [],
  cachedIndexes: [],
};

const defaultCollections: Collection[] = [
  {
    id: "def1",
    isSelected: true,
    name: "Suomi numbers",
    sheetId: "1jBgmXRnafIlAe4zAgZRAGdkBJw-ySHRfza5FPH4HNII",
    state: "empty",
  },
];

type UpdateCollectionStatePayload = Pick<Collection, "id"> &
  Partial<Collection>;

export const loadCollections = createAsyncThunk(
  "collections/loadCollections",
  async () => {
    const response = localStorage.getItem("collections");
    if (response === null) {
      return defaultCollections;
    }
    return JSON.parse(response) as Collection[];
  }
);

export const saveCollections = createAsyncThunk(
  "collections/saveCollections",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    localStorage.setItem(
      "collections",
      JSON.stringify(state.collections.collections)
    );
    return true;
  }
);

export const prepareSelectedCollectios = createAsyncThunk(
  "collections/prepareSelectedCollectios",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const preparationState = selectCollectionsPreparationState(state);
    if (preparationState === "loading") {
      return;
    }
    thunkApi.dispatch(setPreparationState("loading"));
    const collections = selectSelectedCollections(state);
    let updatedCollections = 0;
    for (const collection of collections) {
      if (collection.state === "empty") {
        // load data from GS
        const words = await loadTranslatedPairsFromGoogleSheet(
          collection.sheetId
        );
        thunkApi.dispatch(
          updateCollection({
            id: collection.id,
            state: "ready",
            words,
          })
        );
        updatedCollections += 1;
      }
    }
    if (updatedCollections > 0) {
      await thunkApi.dispatch(saveCollections());
    }
    // build words cache
    thunkApi.dispatch(setPreparationState("ready"));
    thunkApi.dispatch(cacheWords());
    thunkApi.dispatch(updateQuiz());
  }
);

export const loadCollectionData = createAsyncThunk(
  "collections/loadCollectionData",
  async (id: string, thunkApi) => {
    thunkApi.dispatch(
      updateCollection({
        id,
        state: "loading",
      })
    );
    const state = thunkApi.getState() as RootState;
    const collection = selectCollectionDataById(state, id);
    if (!collection || !collection?.sheetId) {
      return false;
    }
    const words = await loadTranslatedPairsFromGoogleSheet(collection.sheetId);
    thunkApi.dispatch(
      updateCollection({
        id: collection.id,
        state: "ready",
        words,
      })
    );

    return true;
  }
);

export const createNewCollection = createAsyncThunk(
  "collections/createNewCollection",
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const id = `uniq_${state.collections.collections.length}${Date.now()}`;
    thunkApi.dispatch(createCollection(id));
    await thunkApi.dispatch(saveCollections());
    return id;
  }
);

export const removeCollectionById = createAsyncThunk(
  "collections/removeCollectionById",
  async (id: string, thunkApi) => {
    thunkApi.dispatch(removeCollection(id));
    await thunkApi.dispatch(saveCollections());
  }
);

export const updateCollectionById = createAsyncThunk(
  "collections/updateCollectionById",
  async ({ name, id, sheetId }: UpdateCollectionStatePayload, thunkApi) => {
    thunkApi.dispatch(
      updateCollection({
        id,
        name,
        sheetId,
      })
    );
    await thunkApi.dispatch(saveCollections());
  }
);

export const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload;
    },
    setPreparationState: (state, action: PayloadAction<State>) => {
      state.preparationState = action.payload;
    },
    setCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
    cacheWords: (state) => {
      const wordsToCache = state.collections.reduce((acc, { words }) => {
        return acc.concat(words ?? []);
      }, [] as TranslatedPair[]);
      state.cachedWords = wordsToCache;
    },
    updateQuiz: (state) => {
      const indexes = state.cachedIndexes.slice(1);
      if (indexes.length > 0) {
        state.cachedIndexes = indexes;
        return;
      }
      const cachedIndexes = state.cachedWords.map((_, index) => index);
      cachedIndexes.forEach((item, index) => {
        const pairIndex = Math.floor(cachedIndexes.length * Math.random());
        cachedIndexes[index] = cachedIndexes[pairIndex];
        cachedIndexes[pairIndex] = item;
      });
      state.cachedIndexes = cachedIndexes;
    },
    createCollection: (state, action: PayloadAction<string>) => {
      console.log("create collection?");
      state.collections = [
        {
          id: action.payload,
          isSelected: false,
          name: "",
          sheetId: "",
          state: "empty",
        },
        ...state.collections,
      ];
    },
    removeCollection: (state, action: PayloadAction<string>) => {
      state.collections = state.collections.filter(
        ({ id: itemId }) => itemId !== action.payload
      );
      console.log("remove", action.payload);
      console.log(state.collections);
    },
    updateCollection: (
      state,
      action: PayloadAction<UpdateCollectionStatePayload>
    ) => {
      const {
        id: cId,
        state: newState,
        isSelected,
        sheetId,
        words,
        name,
      } = action.payload;
      if (!cId) {
        return;
      }
      const item = state.collections.find(({ id }) => id === cId);
      if (!item) {
        return;
      }
      if (newState !== undefined) {
        item.state = newState;
      }
      if (isSelected !== undefined) {
        item.isSelected = isSelected;
      }
      if (sheetId !== undefined) {
        if (sheetId !== item.sheetId) {
          item.words = [];
          item.state = "empty";
        }
        item.sheetId = sheetId;
      }
      if (name !== undefined) {
        item.name = name;
      }
      if (words !== undefined) {
        item.words = words;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCollections.fulfilled, (state, action) => {
      state.state = "ready";
      state.collections = action.payload;
    });
    builder.addCase(loadCollections.pending, (state) => {
      state.state = "loading";
    });
    builder.addCase(loadCollections.rejected, (state) => {
      state.state = "empty";
    });
    builder.addCase(saveCollections.fulfilled, (state) => {
      state.state = "ready";
    });
    builder.addCase(saveCollections.pending, (state) => {
      state.state = "saving";
    });
    builder.addCase(saveCollections.rejected, (state) => {
      state.state = "ready";
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setState,
  setCollections,
  updateCollection,
  cacheWords,
  updateQuiz,
  setPreparationState,
  createCollection,
  removeCollection,
} = collectionsSlice.actions;

// selectors
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
  [selectAllCollections],
  (collections) => collections.filter(({ isSelected }) => isSelected)
);

export const selectCollectionsPreparationState = createSelector(
  selectCollections,
  (state) => state.preparationState
);

export const selectCollectionDataById = createSelector(
  [selectAllCollections, (_, id: string) => id],
  (collections, id) => collections.find(({ id: itemId }) => itemId === id)
);

export const selectCollectionIdAfterDeletion = createSelector(
  [selectAllCollections, (_, id: string) => id],
  (collections, id) => {
    const index = collections.findIndex(({ id: itemId }) => itemId === id);
    if (index < 0) {
      return id;
    }
    if (collections.length === 1) {
      return "";
    }
    if (index >= collections.length - 1) {
      return collections[index - 1].id;
    }
    return collections[index + 1].id;
  }
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

export default collectionsSlice.reducer;
