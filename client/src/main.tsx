import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { ClerkWouterProvider } from "@/components/ClerkWouterProvider";
import App from "./App";
import "./index.css";

applyTheme(getStoredTheme());

const initialTheme = getStoredTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkWouterProvider initialTheme={initialTheme}>
      <App />
    </ClerkWouterProvider>
  </StrictMode>,
);
