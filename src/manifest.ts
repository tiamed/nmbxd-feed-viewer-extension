import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: "src/pages/options/index.html",
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon.png",
  },
  icons: {
    "128": "icon.png",
  },
  declarative_net_request: {
    rule_resources: [
      {
        id: "rule_set",
        enabled: true,
        path: "rules.json",
      },
    ],
  },
  permissions: ["storage", "declarativeNetRequest", "declarativeNetRequestFeedback"],
  host_permissions: ["https://www.nmbxd1.com/*"],
  web_accessible_resources: [
    {
      resources: ["icon.png"],
      matches: [],
    },
  ],
};

export default manifest;
