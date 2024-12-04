import { Phone12Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { addFeed } from "./api";

export default function AddFeedLink({ tid }: { tid?: string }) {
  const [feedId, setFeedId] = useState("");
  const getFeedId = async () => {
    const { nmbFeedId } = await chrome.storage.sync.get("nmbFeedId");
    if (nmbFeedId) {
      setFeedId(nmbFeedId);
    }
  };
  const handleAddFeed = async () => {
    if (!feedId) {
      window.alert("请填写订阅ID");
      return;
    }
    if (!tid) {
      window.alert("缺少参数tid");
      return;
    }
    try {
      const res = await addFeed(feedId, tid);
      if (res.ok) {
        window.alert("订阅成功");
      } else {
        window.alert("订阅失败: " + res.status);
      }
    } catch (error) {
      window.alert("订阅失败");
    }
  };
  useEffect(() => {
    getFeedId();
  });

  if (!tid) return null;

  return (
    <>
      ·
      <a style={{ display: "inline-flex", alignItems: "center" }} onClick={handleAddFeed}>
        订阅
        <Phone12Regular />
      </a>
    </>
  );
}
