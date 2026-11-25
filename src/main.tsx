import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Colour preview: /?palette=ivory shows the proposed ivory-led palette
// (src/styles/palette-ivory.css). Without it, the current palette is used.
if (new URLSearchParams(window.location.search).get("palette") === "ivory") {
  document.documentElement.dataset.palette = "ivory";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
