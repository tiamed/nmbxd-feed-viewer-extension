import ky from "ky";
import { API_URL } from "../../utils/constants";

export function addFeed(feedId: string, tid: string) {
  return ky.get(`${API_URL}/addFeed`, {
    searchParams: { uuid: feedId, tid },
  });
}
