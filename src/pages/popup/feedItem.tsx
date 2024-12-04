import { Delete12Regular } from "@fluentui/react-icons";
import { Feed } from "./api";

interface FeedItemProps {
  data: Partial<Feed>;
  onDelete?: () => void;
  onClick?: () => void;
  forumName: string;
}

export default function FeedItem(props: FeedItemProps) {
  const { data: item } = props;

  return (
    <li className="w-full border-b border-b-ctp-surface1 pb-2" onClick={props.onClick}>
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
            props.onDelete?.();
          }}>
          <Delete12Regular className="text-ctp-red" style={{ verticalAlign: "-1.5px" }} />
        </div>
        <div className="text-ctp-flamingo">{item.reply_count}</div>
        <div className="text-ctp-rosewater">{props.forumName}</div>
      </div>
      <div
        className="text-start line-clamp-10"
        dangerouslySetInnerHTML={{ __html: item.content ?? "" }}></div>
    </li>
  );
}
