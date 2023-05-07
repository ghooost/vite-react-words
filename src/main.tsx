import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./index.css";
import { IsMobile } from "@components/IsMobile";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <IsMobile mobileWidth={800}>
        <RouterProvider router={router} />
      </IsMobile>
    </Provider>
  </React.StrictMode>
);
