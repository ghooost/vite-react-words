import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import { Page } from "@components/Page";
import { ErrorPage } from "@components/ErrorPage";
import { Home } from "@components/Home";
import { Setup } from "@components/Setup";
import { CollectionEdit } from "@components/CollectionEdit";
import { store } from "@store/index";
import {
  createNewCollection,
  loadCollections,
  removeCollectionById,
  selectCollectionIdAfterDeletion,
  updateCollectionById,
} from "@store/collectionsSlice";
import { Base } from "@router/contants";
import { MobileCollectionList } from "@components/MobileCollectionList";

// loaders
export const rootLoader = async () => {
  // start initial loadings
  return await store.dispatch(loadCollections());
};

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
  // extract collection id from URL
  return params.collectionId;
};

// actions
export const actionCreate = async () => {
  // load data from storage
  const action = await store.dispatch(createNewCollection());
  return redirect(`${Base}setup/${action.payload}`);
};

export const actionDelete = async ({ params }: ActionFunctionArgs) => {
  const { collectionId } = params;
  if (!collectionId) {
    return redirect(`${Base}setup`);
  }
  const nextId = selectCollectionIdAfterDeletion(
    store.getState(),
    collectionId
  );
  await store.dispatch(removeCollectionById(collectionId));
  return redirect(`${Base}setup/${nextId}`);
};

export const actionUpdate = async ({ request, params }: ActionFunctionArgs) => {
  const { name, sheetId, isSelected } = Object.fromEntries(
    await request.formData()
  );
  const { collectionId } = params;
  if (!collectionId) {
    return;
  }
  let parsedSheetId = sheetId.toString();
  const match = /docs\.google\.com\/spreadsheets\/d\/([^/]+)/i.exec(
    parsedSheetId
  );
  if (match?.[1]) {
    parsedSheetId = match[1];
  }
  await store.dispatch(
    updateCollectionById({
      id: collectionId,
      sheetId: parsedSheetId,
      name: name.toString(),
      isSelected: isSelected !== undefined,
    })
  );
  return redirect(`${Base}setup/${collectionId}`);
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={Base}
      element={<Page />}
      errorElement={<ErrorPage />}
      loader={rootLoader}
    >
      <Route index element={<Home />} />
      <Route path={"setup"} element={<Setup />}>
        <Route index element={<MobileCollectionList />} />
        <Route path="create" action={actionCreate}></Route>
        <Route
          path={":collectionId"}
          loader={collectionLoader}
          action={actionUpdate}
          element={<CollectionEdit />}
        >
          <Route path="delete" action={actionDelete}></Route>
        </Route>
      </Route>
    </Route>
  )
);
