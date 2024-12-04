import {
  Board16Filled,
  Color16Filled,
  Person16Filled,
  Settings16Filled,
} from "@fluentui/react-icons";
import { themes } from "@src/utils/constants";
import useChromeStorage from "@src/utils/hooks/useChromeStorage";
import { applyTheme } from "@src/utils/theme";
import { useInfiniteScroll } from "ahooks";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { deleteFeed, Feed, ForumSimple, getFeeds, getForums } from "./api";
import { Dropdown } from "./dropdown";
import FeedItem from "./feedItem";

const PAGE_SIZE = 10;

export default function Popup(): JSX.Element {
  const [feedId, setFeedId] = useChromeStorage("nmbFeedId", "");
  const [feedIds] = useChromeStorage<string[]>("nmbFeedIds", []);
  const [keyword, setKeyword] = useState<string>("");
  const [filterForum, setFilterForum] = useState("");
  const [forums, setForums] = useState<ForumSimple[]>();
  const [theme, setTheme] = useChromeStorage<string>("nmbFeedTheme", "ctp-mocha");
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const getLoadMoreList = async (id: string, page: number) => {
    if (!id) return { list: [], hasMore: false };
    try {
      const result = await getFeeds(id, page);
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

  const confirmDeleteFeed = async (id: string) => {
    if (window.confirm("确认删除订阅?")) {
      try {
        await deleteFeed(feedId, id);
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
        list: list.filter((item: Feed) => !d?.list.find((i) => i.id === item.id)),
        hasMore: hasMore && !list.every((item: Feed) => d?.list.find((i) => i.id === item.id)),
      };
    },
    {
      isNoMore(data) {
        return !data?.hasMore;
      },
      reloadDeps: [feedId],
    }
  );

  const filteredList = useMemo(() => {
    let filtered = data?.list;
    if (filterForum) {
      filtered = filtered?.filter((item: Feed) => item.fid === filterForum);
    }
    if (keyword) {
      const lowercaseKeyword = keyword.toLowerCase();
      filtered = filtered?.filter(
        (item: Feed) =>
          item.title?.toLowerCase()?.includes(lowercaseKeyword) ||
          item.content?.toLowerCase()?.includes(lowercaseKeyword) ||
          item.name?.toLowerCase()?.includes(lowercaseKeyword)
      );
    }
    return filtered;
  }, [data, keyword, filterForum]);

  useEffect(() => {
    getForums().then((res) => {
      // flatten
      setForums([...res, ...res.map((item) => item.forums || []).flat()]);
    });
  }, [keyword]);

  useEffect(() => {
    setKeyword("");
  }, [feedId]);

  useEffect(() => {
    // observe loadMore, when visible load more
    let observer: IntersectionObserver | null = null;
    let timeout: NodeJS.Timeout;
    if (loadMoreRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && data?.hasMore) {
          if (!timeout) {
            loadMore();
          }
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            loadMore();
          }, 500);
        }
      });
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer?.disconnect();
      timeout && clearTimeout(timeout);
    };
  }, [feedId, loading, loadingMore, data?.hasMore]);

  return (
    <div className="text-center bg-ctp-base relative">
      <div
        className="sticky top-0 right-0 flex items-center justify-end gap-2 p-2 px-3 bg-ctp-surface0"
        style={{ zIndex: 1 }}>
        <input
          className="flex-1 p-0.5 text-xs bg-ctp-surface2 text-ctp-subtext1 placeholder:text-ctp-subtext0 rounded-md"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="搜索关键词"
        />
        <Dropdown
          width={90}
          dropdown={[{ name: "全部", id: "" }, ...(forums || [])]?.map((forum) => (
            <div
              className={clsx(
                "p-1 text-xs text-ctp-text hover:bg-ctp-surface1 cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden",
                forum.id === filterForum ? "bg-ctp-surface1" : "bg-ctp-surface0"
              )}
              key={forum.id}
              onClick={() => {
                setFilterForum(forum.id);
              }}>
              {forum.name}
            </div>
          ))}>
          <Board16Filled className="text-ctp-subtext0 cursor-pointer" />
        </Dropdown>

        <Dropdown
          width={90}
          dropdown={(feedIds.length ? feedIds : [feedId]).map((id) => (
            <div
              className={clsx(
                "p-1 text-xs text-ctp-text hover:bg-ctp-surface1 cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden",
                feedId === id ? "bg-ctp-surface1" : "bg-ctp-surface0"
              )}
              key={id}
              onClick={() => {
                setFeedId(id);
              }}>
              {id}
            </div>
          ))}>
          <Person16Filled className="text-ctp-subtext0 cursor-pointer" />
        </Dropdown>

        <Dropdown
          width={90}
          dropdown={themes.map((item) => (
            <div
              className={clsx(
                "p-1 text-xs text-ctp-text hover:bg-ctp-surface1 cursor-pointer",
                theme === item.value ? "bg-ctp-surface1" : "bg-ctp-surface0"
              )}
              key={item.value}
              onClick={() => {
                setTheme(item.value);
              }}>
              {item.label}
            </div>
          ))}>
          <Color16Filled className="text-ctp-subtext0 cursor-pointer" />
        </Dropdown>

        <Settings16Filled
          className="text-ctp-subtext0 cursor-pointer"
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        />
      </div>

      {feedId ? (
        <ul className="flex flex-col flex-nowrap items-center justify-center gap-2 p-3 text-xs text-ctp-text select-none">
          {filteredList?.map((item: Feed) => (
            <FeedItem
              key={item.id}
              data={item}
              forumName={forums?.find((forum) => forum.id === item.fid)?.name || ""}
              onDelete={() => {
                confirmDeleteFeed(item.id);
              }}
              onClick={async () => {
                const url = new URL(`https://www.nmbxd1.com/t/${item.id}`);
                try {
                  const {
                    nmbPages: { [item.id]: page },
                  } = await chrome.storage.sync.get("nmbPages");
                  if (page) {
                    url.searchParams.set("page", page);
                  }
                } finally {
                  window.open(url.href, "_blank");
                }
              }}></FeedItem>
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
        <div className="text-ctp-text p-6 text-lg">点击右上角图标进入选项设置订阅ID</div>
      )}
    </div>
  );
}
