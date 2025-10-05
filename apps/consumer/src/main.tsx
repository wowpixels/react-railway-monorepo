import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// railway
import { RailwayProvider } from "react-railway";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RailwayProvider>
      <App />
    </RailwayProvider>
  </StrictMode>
);
