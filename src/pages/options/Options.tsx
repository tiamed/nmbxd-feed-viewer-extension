import React, { useEffect, useState } from "react";
import "@pages/options/Options.css";

export default function Options(): JSX.Element {
  const [feedId, setFeedId] = useState<string | undefined>();
  const [theme, setTheme] = useState<string | undefined>();
  const getFeedId = async () => {
    const { nmbFeedId } = await chrome.storage.sync.get("nmbFeedId");
    if (nmbFeedId) {
      setFeedId(nmbFeedId);
    }
  };
  const getTheme = async () => {
    const { nmbFeedTheme } = await chrome.storage.sync.get("nmbFeedTheme");
    if (nmbFeedTheme) {
      setTheme(nmbFeedTheme);
    }
  };

  const updateStorage = async (key: string, value: any) => {
    if (value !== undefined) {
      await chrome.storage.sync.set({ [key]: value });
    }
  };

  useEffect(() => {
    getFeedId();
    getTheme();
  }, []);
  useEffect(() => {
    updateStorage("nmbFeedId", feedId);
  }, [feedId]);
  useEffect(() => {
    updateStorage("nmbFeedTheme", theme);
  }, [theme]);
  return (
    <div className={`container ${theme} relative`}>
      <label className="item">
        <div className="label">订阅ID</div>
        <input
          value={feedId}
          onChange={(e) => setFeedId(e.target.value)}
          placeholder="APP端订阅ID"
        />
      </label>
      <label className="item">
        <div className="label">主题</div>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">默认</option>
          <option value="ctp-frappe">frappe</option>
          <option value="ctp-macchiato">macchiato</option>
          <option value="ctp-mocha">mocha</option>
          <option value="ctp-latte">latte</option>
        </select>
      </label>
      <footer>
        <a onClick={() => window.open("https://github.com/tiamed/nmbxd-feed-viewer-extension")}>
          Github
        </a>
        <a onClick={() => window.open("https://www.nmbxd1.com/")}>X岛</a>
      </footer>
    </div>
  );
}
