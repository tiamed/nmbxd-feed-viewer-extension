import { useClickAway } from "ahooks";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Dropdown(props: {
  children?: React.ReactNode;
  dropdown?: React.ReactNode;
  width?: number;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [show, setShow] = useState(false);
  const width = props.width || 200;

  useClickAway(() => setShow(false), triggerRef);

  const dropdownDom = (
    <div
      ref={dropdownRef}
      className={`fixed ${show ? "block" : "hidden"} mt-1 max-h-60 overflow-y-auto`}
      style={{ left: position[0], top: position[1], width, zIndex: 100 }}
      onClick={() => setShow(false)}>
      {props.dropdown}
    </div>
  );

  return (
    <>
      {createPortal(dropdownDom, document.getElementById("__root")!)}
      <div
        ref={triggerRef}
        className="contents"
        onClick={() => {
          if (triggerRef.current) {
            const rect = triggerRef.current.children[0].getBoundingClientRect();
            setPosition([rect.left + rect.width - width, rect.bottom]);
            setShow(!show);
          }
        }}>
        {props.children}
      </div>
    </>
  );
}
