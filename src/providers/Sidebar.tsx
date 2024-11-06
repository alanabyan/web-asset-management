import type { StoreApi } from "zustand";
import * as React from "react";

import type { SidebarStore } from "@/stores/sidebar";
import { SidebarContext } from "@/contexts/sidebar";
import { createSidebarStore } from "@/stores/sidebar";

interface Props extends React.PropsWithChildren {}

export default function SidebarProvider({ children }: Props) {
  const storeRef = React.useRef<StoreApi<SidebarStore>>();

  if (!storeRef.current) {
    storeRef.current = createSidebarStore();
  }

  return (
    <SidebarContext.Provider value={storeRef.current}>
      {children}
    </SidebarContext.Provider>
  );
}
