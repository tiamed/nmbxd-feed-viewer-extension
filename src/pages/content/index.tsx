import { createRoot } from "react-dom/client";
import "./style.css";
import AddFeedLink from "./AddFeedLink";

function addSubscriptionByPath() {
  const tid = window.location.pathname.split("/t/")?.[1];
  const feedLinkDom = document.querySelector('a[href^="/Home/Forum/addFeed"]');
  feedLinkDom?.insertAdjacentHTML("afterend", '<div id="__root"></div>');
  const rootContainer = feedLinkDom?.parentNode?.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Options root element");
  const root = createRoot(rootContainer);
  root.render(<AddFeedLink tid={tid}></AddFeedLink>);
}

function addSubScriptionByElement(el: Element) {
  const tid = el.getAttribute("data-threads-id") ?? "";
  const feedLinkDom = el.querySelector('a[href^="/Home/Forum/addFeed"]');
  feedLinkDom?.insertAdjacentHTML("afterend", '<div id="__root"></div>');
  const rootContainer = el.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Options root element");
  const root = createRoot(rootContainer);
  root.render(<AddFeedLink tid={tid}></AddFeedLink>);
}

async function addPageQueryToReply(el: Element) {
  const tid = el.getAttribute("data-threads-id") ?? "";
  const replyDom = el.querySelector(".h-threads-info-reply-btn a");
  try {
    const {
      nmbPages: { [tid]: page },
    } = await chrome.storage.sync.get("nmbPages");
    if (page) {
      replyDom?.setAttribute("href", `/t/${tid}?page=${page}`);
    }
  } catch (e) {
    console.info(e);
  }
}

function init(refresh = false) {
  switch (true) {
    case window.location.pathname.startsWith("/t/"):
      if (!refresh) {
        addSubscriptionByPath();
      }
      break;
    case window.location.pathname.startsWith("/f/") ||
      window.location.pathname.startsWith("/Forum/"):
      try {
        const threadDoms = document.querySelectorAll(".h-threads-list > [data-threads-id]");
        threadDoms.forEach((threadDom) => {
          if (!threadDom.getAttribute("data-extension-modified")) {
            addSubScriptionByElement(threadDom);
            addPageQueryToReply(threadDom);
            threadDom.setAttribute("data-extension-modified", "true");
          }
        });
      } catch (e) {
        console.error(e);
      }
      break;
    default:
      break;
  }
}

init();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "historyUpdated") {
    init(true);
  }
  sendResponse();
});

new MutationObserver(() => init(false)).observe(document.querySelector(".h-threads-list")!, {
  childList: true,
});
