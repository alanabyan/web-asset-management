// SidebarItem.tsx
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSidebarContext } from "@/contexts/sidebar";
import { cn } from "@/utils/shadcn";

import {
  Tooltip,
  TooltipCaret,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  label: string;
  path: string;
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
}

export default function SidebarItem({
  label,
  path,
  leftIcon,
  rightIcon,
}: Props) {
  const { expanded } = useSidebarContext((state) => state);
  const router = useRouter();
  const isActive = router.pathname === path;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={path} passHref>
          <li
            className={cn(
              "flex h-10 cursor-pointer items-center justify-between px-3 py-2 text-[#A91D43] hover:rounded-[0.375rem] hover:bg-merah-primary hover:text-white",
              isActive
                ? "rounded-[0.375rem] bg-white font-bold text-[#A91D43]"
                : "",
            )}
          >
            <div className="flex items-center gap-2">
              {leftIcon && <span>{leftIcon}</span>}
              <span className={cn("whitespace-nowrap", !expanded && "hidden")}>
                {label}
              </span>
            </div>
            {rightIcon && <span>{rightIcon}</span>}
          </li>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className={cn(expanded && "hidden")}>
        <TooltipCaret placement="left" />
        <span className="text-sm font-bold">{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}
