import React from "react";

import { ScrollArea } from "../ui/scroll-area";

interface Props extends React.PropsWithChildren {}

export default function Content({ children }: Props) {
  return (
    <div className="flex flex-col">
      <ScrollArea className="flex-1 overflow-auto">{children}</ScrollArea>
    </div>
  );
}
