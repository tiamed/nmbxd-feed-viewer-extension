import React from "react";
import { createRoot } from "react-dom/client";
import "@pages/popup/index.css";
import "@assets/styles/tailwind.css";
import Popup from "@pages/popup/Popup";

async function init() {
  const { nmbFeedTheme } = await chrome.storage.sync.get("nmbFeedTheme");
  const rootContainer = document.querySelector("#__root");
  rootContainer?.setAttribute("class", nmbFeedTheme);
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();
