import type { StoreApi } from "zustand";
import * as React from "react";
import { useStore } from "zustand";

import type { SidebarStore } from "@/stores/sidebar";

export const SidebarContext =
  React.createContext<StoreApi<SidebarStore> | null>(null);

export const useSidebarContext = <T>(
  selector: (store: SidebarStore) => T,
): T => {
  const sidebarContext = React.useContext(SidebarContext);

  if (!sidebarContext) {
    throw new Error(
      `useSidebarStoreContext must be use within SidebarStoreProvider`,
    );
  }

  return useStore(sidebarContext, selector);
};
