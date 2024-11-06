import * as React from "react";
import { ChevronLeftIcon } from "lucide-react";

import { useSidebarContext } from "@/contexts/sidebar";
import { cn } from "@/utils/shadcn";

import { Icons } from "../ui/icons";

interface Props extends React.PropsWithChildren {}

export default function Sidebar({ children }: Props) {
  const { expanded } = useSidebarContext((state) => state);

  return (
    <aside
      className={cn(
        "flex h-[52rem] flex-col overflow-y-hidden rounded-xl bg-white shadow-xl transition-[width]",
        expanded ? "w-72" : "w-[4.75rem]",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-between px-4 py-6",
          expanded && "px-6",
        )}
      ></div>
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-2">{children}</div>
        </ul>
      </nav>
    </aside>
  );
}
