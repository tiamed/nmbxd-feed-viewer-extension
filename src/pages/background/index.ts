const filter = {
  url: [
    {
      urlMatches: "https://www.nmbxd1.com/t/",
    },
  ],
};

async function updatePageFromUrl(url: string) {
  const urlObject = new URL(url);
  const page = urlObject.searchParams.get("page");
  const tid = urlObject.pathname.split("/t/")?.[1];
  if (page) {
    const { nmbPages = {} } = await chrome.storage.sync.get("nmbPages");
    chrome.storage.sync.set({ nmbPages: { ...nmbPages, [tid]: page } });
  }
}

chrome.webNavigation.onCompleted.addListener((details) => {
  updatePageFromUrl(details.url);
}, filter);

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  updatePageFromUrl(details.url);
  chrome.tabs.sendMessage(details.tabId, { type: "historyUpdated" });
}, filter);
