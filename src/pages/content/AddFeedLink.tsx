import { Phone12Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";

export default function AddFeedLink({ tid }: { tid?: string }) {
  const [feedId, setFeedId] = useState("");
  const getFeedId = async () => {
    const { nmbFeedId } = await chrome.storage.sync.get("nmbFeedId");
    if (nmbFeedId) {
      setFeedId(nmbFeedId);
    }
  };
  const addFeed = () => {
    fetch(`https://www.nmbxd1.com/Api/addFeed?uuid=${feedId}&tid=${tid}`).then((res) => {
      if (res.ok) {
        window.alert("订阅成功");
      } else {
        window.alert("订阅失败: " + res.status);
      }
    });
  };
  useEffect(() => {
    getFeedId();
  });
  return (
    <>
      ·
      <a style={{ display: "inline-flex", alignItems: "center" }} onClick={addFeed}>
        订阅
        <Phone12Regular />
      </a>
    </>
  );
}
