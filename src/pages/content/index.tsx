import { createRoot } from "react-dom/client";
import "./style.css";
import AddFeedLink from "./AddFeedLink";

switch (true) {
  case window.location.pathname.startsWith("/t/"):
    try {
      const tid = window.location.pathname.split("/").findLast((x) => x);
      const feedLinkDom = document.querySelector('a[href^="/Home/Forum/addFeed"]');
      feedLinkDom?.insertAdjacentHTML("afterend", '<div id="__root"></div>');
      const rootContainer = feedLinkDom?.parentNode?.querySelector("#__root");
      if (!rootContainer) throw new Error("Can't find Options root element");
      const root = createRoot(rootContainer);
      root.render(<AddFeedLink tid={tid}></AddFeedLink>);
    } catch (e) {
      console.error(e);
    }
    break;
  case window.location.pathname.startsWith("/f/"):
    try {
      const threadDoms = document.querySelectorAll(".h-threads-list > [data-threads-id]");
      threadDoms.forEach((threadDom) => {
        const tid = threadDom.getAttribute("data-threads-id") ?? "";
        const feedLinkDom = threadDom.querySelector('a[href^="/Home/Forum/addFeed"]');
        feedLinkDom?.insertAdjacentHTML("afterend", '<div id="__root"></div>');
        const rootContainer = threadDom.querySelector("#__root");
        if (!rootContainer) throw new Error("Can't find Options root element");
        const root = createRoot(rootContainer);
        root.render(<AddFeedLink tid={tid}></AddFeedLink>);
      });
    } catch (e) {
      console.error(e);
    }
    break;
  default:
    break;
}
