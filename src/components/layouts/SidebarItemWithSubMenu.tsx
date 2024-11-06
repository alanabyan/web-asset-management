// SidebarItemWithSubMenu.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "lucide-react";

import { useSidebarContext } from "@/contexts/sidebar";
import { cn } from "@/utils/shadcn";

import { Collapsible } from "../ui/collapsible";
import SidebarItem from "./SidebarItem";

interface SubMenu {
  id: string;
  label: string;
  path: string;
}

interface Props {
  id: string;
  label: string;
  path: string;
  subMenus: SubMenu[];
  Icon?: React.JSX.Element;
}

export default function SidebarItemWithSubMenu({
  label,
  path,
  subMenus,
  Icon,
}: Props) {
  const router = useRouter();
  const pathname = router.pathname;
  const { expanded: sidebarExpanded } = useSidebarContext((state) => state);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(subMenus.some((sm) => pathname.startsWith(sm.path)));
  }, [pathname, subMenus]);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleExpand}
        className="flex w-full items-center rounded p-2 text-gray-700 hover:bg-gray-200"
      >
        {Icon && <span className="mr-2">{Icon}</span>}
        <span>{label}</span>
        <ChevronDownIcon
          className={`ml-auto transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <Collapsible open={expanded && sidebarExpanded}>
        <ul className="ml-5 flex flex-col gap-2 overflow-hidden border-l border-l-[#de9ede] pl-3 transition-all">
          {subMenus.map((sm) => (
            <SidebarItem key={sm.id} label={sm.label} path={sm.path} />
          ))}
        </ul>
      </Collapsible>
    </div>
  );
}
