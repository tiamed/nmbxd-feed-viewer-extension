import type { DeclarativeNetRequest } from 'webextension-polyfill';

const rules: DeclarativeNetRequest.Rule[] = [
  {
    id: 1,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "user-agent",
          operation: "set",
          value:
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
        },
      ],
    },
    condition: { regexFilter: "https://www.nmbxd1.com/*", resourceTypes: ["xmlhttprequest"], excludedInitiatorDomains: ["www.nmbxd1.com", "nmbxd1.com"] },
  },
];

export default rules;