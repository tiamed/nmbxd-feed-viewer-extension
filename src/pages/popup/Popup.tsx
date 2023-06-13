import React, { useEffect, useState } from "react";
import { useInfiniteScroll } from "ahooks";
import { Delete12Regular } from "@fluentui/react-icons";

interface FeedItem {
  id: string;
  user_id: string;
  fid: string;
  reply_count: string;
  recent_replies: string;
  category: string;
  file_id: string;
  img: string;
  ext: string;
  now: string;
  user_hash: string;
  name: string;
  email: string;
  title: string;
  content: string;
  status: string;
  admin: string;
  hide: string;
  po: string;
}

interface Forum {
  name: string;
  id: string;
}

const PAGE_SIZE = 10;

export default function Popup(): JSX.Element {
  const [feedId, setFeedId] = useState("");
  const [forums, setForums] = useState<Forum[]>();
  const [initiated, setInitiated] = useState(false);
  const loadMoreRef = React.useRef<any>(null);

  const getLoadMoreList = async (id: string, page: number) => {
    if (!id) return { list: [], hasMore: false };
    try {
      const response = await fetch(`https://www.nmbxd1.com/Api/feed?uuid=${id}&page=${page}`);
      const result = await response.json();
      return {
        list: result ?? [],
        hasMore: result?.length > 0,
      };
    } catch (error) {
      return {
        list: [],
        hasMore: false,
      };
    }
  };

  const deleteFeed = async (id: string) => {
    if (window.confirm("确认删除订阅?")) {
      try {
        await fetch(`https://www.nmbxd1.com/Api/delFeed?uuid=${feedId}&tid=${id}`);
        window.alert("删除成功");
        reload();
      } catch (error) {
        console.log(error);
        window.alert("删除失败");
      }
    }
  };

  const { data, loading, loadMore, loadingMore, reload } = useInfiniteScroll(
    async (d) => {
      const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1;
      const { list, hasMore } = await getLoadMoreList(feedId, page);
      return {
        list: list.filter((item: FeedItem) => !d?.list.find((i) => i.id === item.id)),
        hasMore: hasMore && !list.every((item: FeedItem) => d?.list.find((i) => i.id === item.id)),
      };
    },
    {
      isNoMore(data) {
        return !data?.hasMore;
      },
      reloadDeps: [feedId],
    }
  );

  useEffect(() => {
    const getFeedId = async () => {
      const { nmbFeedId } = await chrome.storage.sync.get("nmbFeedId");
      if (nmbFeedId) {
        setFeedId(nmbFeedId);
      }
    };

    const getForums = async () => {
      const response = await fetch(`https://www.nmbxd1.com/Api/getForumList`);
      const result = await response.json();
      setForums(
        result?.reduce((acc: any[], cur: { forums: any[] }) => {
          acc.push(...cur.forums.map((forum) => ({ name: forum.name, id: forum.id })));
          return acc;
        }, [])
      );
    };

    getFeedId().then(() => {
      setInitiated(true);
    });
    getForums();
  }, []);

  useEffect(() => {
    // observe loadMore, when visible load more
    let observer: IntersectionObserver | null = null;
    let timeout: any;
    if (loadMoreRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && data?.hasMore) {
          if (!timeout) {
            loadMore();
          }
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            loadMore();
          }, 300);
        }
      });
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer?.disconnect();
    };
  }, [feedId, loading, loadingMore, data?.hasMore]);

  return (
    <div className="text-center p-3 bg-ctp-base">
      {feedId ? (
        <ul className="flex flex-col flex-nowrap items-center justify-center gap-2 text-xs text-ctp-text select-none">
          {data?.list?.map((item: FeedItem) => (
            <li
              key={item.id}
              className="w-full border-b border-b-ctp-surface1 pb-2"
              onClick={() => window.open(`https://www.nmbxd1.com/t/${item.id}`)}>
              <div className="flex justify-between">
                <div className="text-ctp-text text-start w-16">{item.user_hash}</div>
                <div className="text-ctp-text">No.{item.id}</div>
                <div className="text-ctp-subtext0 tabular-nums">{item.now}</div>
              </div>
              <div className="flex items-start justify-end gap-1.5 mt-1">
                <div className="flex flex-col items-start grow">
                  <div className="text-ctp-text/50">{item.title}</div>
                  <div className="text-ctp-text/50">{item.name}</div>
                </div>
                <div
                  className="relative block before:absolute before:content[''] before:-left-3 before:-right-3 before:-top-3 before:-bottom-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFeed(item.id);
                  }}>
                  <Delete12Regular className="text-ctp-red" style={{ verticalAlign: "-1.5px" }} />
                </div>
                <div className="text-ctp-flamingo">{item.reply_count}</div>
                <div className="text-ctp-rosewater">
                  {forums?.find((forum) => forum.id === item.fid)?.name}
                </div>
              </div>
              <div className="text-start" dangerouslySetInnerHTML={{ __html: item.content }}></div>
            </li>
          ))}
          <div ref={loadMoreRef}>
            {data?.hasMore && (
              <button type="button" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "加载中..." : "点击"}
              </button>
            )}

            {!data?.hasMore && !loading && <span>没有更多了</span>}
          </div>
        </ul>
      ) : (
        initiated && <div className="text-ctp-text">右键进入选项设置订阅ID</div>
      )}
    </div>
  );
}
