import * as React from "react";

import { Menu } from "@/types";

import { Icons } from "../ui/icons";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import SidebarItemWithSubMenu from "./SidebarItemWithSubMenu";

interface Props extends React.PropsWithChildren {}
const menus: Menu[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    Icon: (props) => <Icons.home {...props} />,

    roles: "*",
  },
  {
    id: "assets",
    label: "Assets",
    path: "/assets",
    Icon: (props) => <Icons.home {...props} />,

    roles: "*",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/accesories",
    Icon: (props) => <Icons.home {...props} />,

    roles: "*",
  },
  {
    id: "components",
    label: "Components",
    path: "/component",
    Icon: (props) => <Icons.home {...props} />,

    roles: "*",
  },
  {
    id: "people",
    label: "People",
    path: "/people",
    Icon: (props) => <Icons.home {...props} />,

    roles: "*",
  },
];

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-w-screen relative flex min-h-screen flex-col">
      <div className="absolute left-0 top-0 z-10 w-full">
        <Navbar  />
      </div>

      <div className="ml-5 flex pt-32">
        <Sidebar>
          {menus.map((menu) => {
            if (menu.roles !== "*" && Array.isArray(menu.roles)) {
              return null;
            }

            if (menu.subMenus?.length) {
              return (
                <SidebarItemWithSubMenu
                  key={menu.id}
                  id={menu.id}
                  label={menu.label}
                  path={menu.path}
                  subMenus={menu.subMenus}
                />
              );
            }

            return (
              <SidebarItem key={menu.id} label={menu.label} path={menu.path} />
            );
          })}
        </Sidebar>
        {/* Content */}
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-hidden p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
