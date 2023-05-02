import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  selectCollectionsPreparationState,
  selectSelectedCollections,
} from "./collectionsSelectors";
import { GoogledWindow, loadGoogleSheet, setSettings } from "@api/googleSheet";

type State = "empty" | "loading" | "saving" | "ready";

export interface TranslatedPair {
  orig: string;
  translation: string;
}

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
  "collections/loadWordsForSelectedCollectios",
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
        setSettings(window as GoogledWindow, document);
        const data = await loadGoogleSheet(collection.sheetId);
        const words = data?.table.rows.reduce((acc, { c: cells }) => {
          if (cells.length < 2) {
            return acc;
          }
          if (!cells[0]?.v || !cells[1]?.v) {
            return acc;
          }
          acc.push({
            orig: cells[0].v,
            translation: cells[1].v,
          });
          return acc;
        }, [] as TranslatedPair[]);
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
  "collections/saveCollections",
  async (id: string, thunkApi) => {
    thunkApi.dispatch(
      updateCollection({
        id,
        state: "loading",
      })
    );
    const state = thunkApi.getState() as RootState;
    localStorage.setItem(
      "collections",
      JSON.stringify(state.collections.collections)
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
      } = action.payload;
      if (!cId) {
        return;
      }
      const item = state.collections.find(({ id }) => id === cId);
      if (!item) {
        return;
      }
      if (newState) {
        item.state = newState;
      }
      if (isSelected) {
        item.isSelected = isSelected;
      }
      if (sheetId) {
        item.sheetId = sheetId;
      }
      if (words) {
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
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
