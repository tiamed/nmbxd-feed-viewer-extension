chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery === 'fetchUrl') {
    fetch(request.url, request.options)
      .then((response) => {
        response.json().then((json) => {
          sendResponse({ response: json });
        })
      })
      .catch((error) => sendResponse({ error: error.toJSON ? error.toJSON() : error }));
    return true; // Will respond asynchronously.
  }
});
