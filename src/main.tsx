import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import "./index.css";
import { IsMobile } from "@components/IsMobile";
import { I18n } from "./i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <IsMobile mobileWidth={800}>
        <I18n useLocalStorage lang="en">
          <RouterProvider router={router} />
        </I18n>
      </IsMobile>
    </Provider>
  </React.StrictMode>
);
