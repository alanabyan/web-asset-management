import * as React from "react";

import { cn } from "@/utils/shadcn";

interface CollapsibleProps extends React.PropsWithChildren {
  className?: string;
  open: boolean;
  orientation?: "vertical" | "horizontal";
  collapsedSize?: number | string;
}

const Collapsible = ({
  children,
  className,
  open,
  orientation = "vertical",
  collapsedSize = 0,
}: CollapsibleProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const innerPanelRef = panelRef.current?.children[0];
  const [height, setHeight] = React.useState(collapsedSize);
  const [width, setWidth] = React.useState(collapsedSize);

  let style = {};

  if (orientation === "vertical") {
    style = { height };
  } else {
    style = { width };
  }

  React.useEffect(() => {
    setExpanded(open);
  }, [open]);

  React.useEffect(() => {
    if (!innerPanelRef) {
      return;
    }

    const resizeObserver = new ResizeObserver((observer) => {
      const target = observer[0]?.target;
      setHeight(Number(expanded ? target?.clientHeight : collapsedSize));
      setWidth(Number(expanded ? target?.clientWidth : collapsedSize));
    });
    resizeObserver.observe(innerPanelRef);
    return () => resizeObserver.disconnect();
  }, [collapsedSize, expanded, innerPanelRef]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "overflow-hidden duration-300",
        orientation === "vertical"
          ? "transition-[height]"
          : "transition-[width]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export { Collapsible };
