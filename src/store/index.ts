import { configureStore } from "@reduxjs/toolkit";
import collectionsSlice, {
  createNewCollection,
  loadCollections,
} from "./collectionsSlice";
import { useDispatch } from "react-redux";
import { redirect } from "react-router-dom";

export const store = configureStore({
  reducer: {
    collections: collectionsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types

// loaders
export const rootLoader = async () => {
  // load data from storage
  return await store.dispatch(loadCollections());
};

export const actionCreate = async () => {
  // load data from storage
  const action = await store.dispatch(createNewCollection());
  console.log(action.payload);
  return redirect(action.payload as string);
};
