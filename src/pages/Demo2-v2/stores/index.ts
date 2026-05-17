import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface BreadcrumbItem {
  adcode: string;
  name: string;
  level: "china" | "province" | "city";
}

interface ConfigStore {
  mapPlayComplete: boolean;
  level: "china" | "province" | "city";
  selectedProvince: string | null;
  selectedCity: string | null;
  breadcrumb: BreadcrumbItem[];

  toggle: (key: keyof Omit<ConfigStore, "toggle" | "reset" | "drillDown" | "drillUp">) => void;
  reset: () => void;
  drillDown: (adcode: string, name: string) => void;
  drillUp: () => void;
  setMapPlayComplete: (v: boolean) => void;
}

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set, get, store) => ({
    mapPlayComplete: false,
    level: "china",
    selectedProvince: null,
    selectedCity: null,
    breadcrumb: [],

    toggle: (key) => set((s) => ({ [key]: !s[key] })),
    reset: () => set(store.getInitialState()),

    drillDown: (adcode, name) => {
      const { level, breadcrumb } = get();
      if (level === "china") {
        set({
          level: "province",
          selectedProvince: adcode,
          selectedCity: null,
          mapPlayComplete: false,
          breadcrumb: [{ adcode: "100000", name: "中国", level: "china" }],
        });
      } else if (level === "province") {
        set({
          level: "city",
          selectedCity: adcode,
          mapPlayComplete: false,
          breadcrumb: [...breadcrumb, { adcode, name, level: "province" }],
        });
      }
    },

    drillUp: () => {
      const { level, breadcrumb } = get();
      if (level === "city") {
        set({
          level: "province",
          selectedCity: null,
          mapPlayComplete: false,
          breadcrumb: breadcrumb.slice(0, -1),
        });
      } else if (level === "province") {
        set({
          level: "china",
          selectedProvince: null,
          mapPlayComplete: false,
          breadcrumb: [],
        });
      }
    },

    setMapPlayComplete: (v) => set({ mapPlayComplete: v }),
  }))
);
