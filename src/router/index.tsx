import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  createBrowserRouter,
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
  return redirect(action.payload as string);
};

export const actionDelete = async ({ params }: ActionFunctionArgs) => {
  const { collectionId } = params;
  if (!collectionId) {
    return redirect("/setup");
  }
  const nextId = selectCollectionIdAfterDeletion(
    store.getState(),
    collectionId
  );
  await store.dispatch(removeCollectionById(collectionId));
  return redirect(`/setup/${nextId}`);
};

export const actionUpdate = async ({ request, params }: ActionFunctionArgs) => {
  const { name, sheetId } = Object.fromEntries(await request.formData());
  const { collectionId } = params;
  if (!collectionId) {
    return;
  }
  await store.dispatch(
    updateCollectionById({
      id: collectionId,
      sheetId: sheetId.toString(),
      name: name.toString(),
    })
  );
  return redirect(`/setup/${collectionId}`);
};

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Page />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "setup",
        element: <Setup />,
        action: actionCreate,
        children: [
          {
            path: ":collectionId",
            loader: collectionLoader,
            action: actionUpdate,
            element: <CollectionEdit />,
            children: [
              {
                path: "delete",
                action: actionDelete,
              },
            ],
          },
        ],
      },
    ],
  },
]);
