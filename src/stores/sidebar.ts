import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

interface SidebarState {
  expanded: boolean;
}

interface SidebarAction {
  toggleExpand: () => void;
}

export type SidebarStore = SidebarState & SidebarAction;

const defaultInitState: SidebarState = {
  expanded: true,
};

export const createSidebarStore = (
  initState: SidebarState | undefined = defaultInitState,
) => {
  return createStore<SidebarStore>()(
    persist(
      (set) => ({
        ...initState,
        toggleExpand: () => set((state) => ({ expanded: !state.expanded })),
      }),
      { name: "SidebarStore" },
    ),
  );
};
