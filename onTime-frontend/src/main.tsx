import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "../i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import "maplibre-gl/dist/maplibre-gl.css";
import { ThemeContextProvider } from "./components/contexts/ThemeContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </I18nextProvider>
  </StrictMode>
);
