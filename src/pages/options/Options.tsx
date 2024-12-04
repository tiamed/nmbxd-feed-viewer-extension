import { AddSquare24Filled, Delete16Filled } from "@fluentui/react-icons";
import { themes } from "@src/utils/constants";
import useChromeStorage from "@src/utils/hooks/useChromeStorage";
import { useCallback, useState } from "react";
import "./Options.css";

export default function Options(): JSX.Element {
  const [theme] = useChromeStorage<string>("nmbFeedTheme", "ctp-mocha");

  return (
    <div className={`container ${theme} relative`}>
      <Configurations />
      <Footer />
    </div>
  );
}

function Configurations() {
  const [feedId, setFeedId] = useChromeStorage<string>("nmbFeedId", "ctp-mocha");
  const [feedIds, setFeedIds] = useChromeStorage<string[]>("nmbFeedIds", []);
  const [theme, setTheme] = useChromeStorage<string>("nmbFeedTheme", "ctp-mocha");
  const [newFeedId, setNewFeedId] = useState<string>("");

  const addFeedId = useCallback(() => {
    if (!newFeedId) return;
    setFeedIds(Array.from(new Set([...(feedIds.length ? feedIds : [feedId]), newFeedId])));
    if (!feedId) {
      setFeedId(newFeedId);
    }
    setNewFeedId("");
  }, [newFeedId, feedId, feedIds]);

  return (
    <div className="configurations">
      <label className="item">
        <div className="label">订阅ID</div>
        <div className="feed-id-list">
          {(feedIds.length ? feedIds : [feedId])
            .filter((x) => x !== "" && x !== null && x !== undefined)
            .map((id) => (
              <div key={id} className="feed-id-item">
                <label htmlFor={id} className="feed-id-radio">
                  <input
                    id={id}
                    type="radio"
                    value={id}
                    checked={feedId === id}
                    onChange={() => setFeedId(id)}
                  />
                  {id}
                </label>
                <button
                  className="feed-id-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("确认删除订阅ID?")) {
                      setFeedIds(feedIds.filter((fid) => fid !== id));
                      if (feedId === id) setFeedId(feedIds[0] ?? "");
                    }
                  }}>
                  <Delete16Filled />
                </button>
              </div>
            ))}
          <div className="add-feed-id">
            <input
              value={newFeedId}
              onChange={(e) => setNewFeedId(e.target.value)}
              placeholder="输入新的订阅ID"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addFeedId();
                }
              }}
            />
            <button onClick={addFeedId}>
              <AddSquare24Filled />
            </button>
          </div>
        </div>
      </label>
      <label className="item">
        <div className="label">主题</div>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="">默认</option>
          {themes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <a onClick={() => window.open("https://github.com/tiamed/nmbxd-feed-viewer-extension")}>
        Github
      </a>
      <a onClick={() => window.open("https://www.nmbxd1.com/")}>X岛</a>
    </footer>
  );
}
