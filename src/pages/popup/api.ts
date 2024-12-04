import { API_URL } from "@src/utils/constants";
import ky from "ky";

export interface Feed {
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

export interface RootForum {
  id: string;
  sort: string;
  name: string;
  status: string;
  forums: Forum[];
}

export interface Forum {
  id: string;
  name: string;
  msg: string;
  fgroup?: string;
  sort?: string;
  showName?: string;
  interval?: string;
  safe_mode?: string;
  auto_delete?: string;
  thread_count?: string;
  permission_level?: string;
  forum_fuse_id?: string;
  createdAt?: string;
  updateAt?: string;
  status?: string;
}

export type ForumSimple = Pick<Forum, "id" | "name">;

export function deleteFeed(feedId: string, tid: string) {
  return ky.get(`${API_URL}/delFeed`, {
    searchParams: { uuid: feedId, tid },
  });
}

export function getForums() {
  return ky.get<RootForum[]>(`${API_URL}/getForumList`).json();
}

export function getFeeds(feedId: string, page: number) {
  return ky
    .get<Feed[]>(`${API_URL}/feed`, {
      searchParams: { uuid: feedId, page },
    })
    .json();
}
