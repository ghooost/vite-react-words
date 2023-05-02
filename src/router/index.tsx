import { createBrowserRouter } from "react-router-dom";
import { Page } from "@components/Page";
import { ErrorPage } from "@components/ErrorPage";
import { Home } from "@components/Home";
import { Setup } from "@components/Setup";
import { CollectionEdit } from "@components/CollectionEdit";
import { actionCreate, rootLoader } from "@store/index";

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Page />,
    errorElement: <ErrorPage />,
    // start initial loading here
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
            path: ":sheetId",
            element: <CollectionEdit />,
          },
        ],
      },
    ],
  },
]);
