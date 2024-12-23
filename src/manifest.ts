import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: "src/pages/options/index.html",
    open_in_tab: true,
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
  permissions: [
    "storage",
    "declarativeNetRequest",
    "declarativeNetRequestFeedback",
    "webNavigation",
  ],
  host_permissions: ["https://www.nmbxd1.com/*"],
  content_scripts: [
    {
      matches: ["https://www.nmbxd1.com/*"],
      js: ["src/pages/content/index.js"],
      css: ["contentStyle.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["icon.png"],
      matches: [],
    },
  ],
};

export default manifest;
