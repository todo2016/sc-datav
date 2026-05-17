import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Customer {
  id: string;
  name: string;
  type: "potential" | "partner" | "key";
  level: "A" | "B" | "C";
  location: {
    province: string;
    provinceName: string;
    city: string;
    cityName: string;
    district: string;
    districtName: string;
    address: string;
    coordinates: [number, number];
  };
  stats: {
    revenue: number;
    employees: number;
    lastContact: string;
    dealCount: number;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  tags: string[];
  createdAt: string;
}

export interface BreadcrumbItem {
  adcode: string;
  name: string;
  level: "china" | "province" | "city";
}

export interface ChinaMapStore {
  level: "china" | "province" | "city";
  mapPlayComplete: boolean;

  selectedProvince: string | null;
  selectedCity: string | null;
  selectedCustomer: string | null;

  breadcrumb: BreadcrumbItem[];

  customers: Customer[];
  filteredCustomers: Customer[];

  toggle: (key: keyof Omit<ChinaMapStore, "toggle" | "reset">) => void;
  reset: () => void;
  drillDown: (adcode: string, name: string) => void;
  drillUp: () => void;
  drillToBreadcrumb: (index: number) => void;
  selectCustomer: (customerId: string | null) => void;
  setMapPlayComplete: (v: boolean) => void;
  setCustomers: (customers: Customer[]) => void;
}

function filterCustomers(
  customers: Customer[],
  level: string,
  selectedProvince: string | null,
  selectedCity: string | null
): Customer[] {
  if (level === "china") return customers;
  if (level === "province" && selectedProvince) {
    return customers.filter((c) => c.location.province === selectedProvince);
  }
  if (level === "city" && selectedCity) {
    return customers.filter((c) => c.location.city === selectedCity);
  }
  return customers;
}

export const useChinaMapStore = create<ChinaMapStore>()(
  subscribeWithSelector((set, get, store) => ({
    level: "china",
    mapPlayComplete: false,
    selectedProvince: null,
    selectedCity: null,
    selectedCustomer: null,
    breadcrumb: [],
    customers: [],
    filteredCustomers: [],

    toggle: (key) => set((s) => ({ [key]: !s[key] })),

    reset: () => set(store.getInitialState()),

    drillDown: (adcode, name) => {
      const { level, customers, selectedProvince } = get();

      if (level === "china") {
        const breadcrumb: BreadcrumbItem[] = [
          { adcode: "100000", name: "中国", level: "china" },
        ];
        set({
          level: "province",
          selectedProvince: adcode,
          mapPlayComplete: false,
          breadcrumb,
          filteredCustomers: filterCustomers(customers, "province", adcode, null),
        });
      } else if (level === "province") {
        const breadcrumb = [
          ...get().breadcrumb,
          { adcode, name, level: "province" as const },
        ];
        set({
          level: "city",
          selectedCity: adcode,
          mapPlayComplete: false,
          breadcrumb,
          filteredCustomers: filterCustomers(customers, "city", selectedProvince, adcode),
        });
      }
    },

    drillUp: () => {
      const { level, breadcrumb, customers, selectedProvince } = get();

      if (level === "city") {
        const newBreadcrumb = breadcrumb.slice(0, -1);
        set({
          level: "province",
          selectedCity: null,
          mapPlayComplete: false,
          breadcrumb: newBreadcrumb,
          filteredCustomers: filterCustomers(customers, "province", selectedProvince, null),
        });
      } else if (level === "province") {
        set({
          level: "china",
          selectedProvince: null,
          mapPlayComplete: false,
          breadcrumb: [],
          filteredCustomers: customers,
        });
      }
    },

    drillToBreadcrumb: (index) => {
      const { breadcrumb, customers } = get();
      if (index < 0 || index >= breadcrumb.length) return;

      const item = breadcrumb[index];

      if (item.level === "china") {
        set({
          level: "china",
          selectedProvince: null,
          selectedCity: null,
          mapPlayComplete: false,
          breadcrumb: [],
          filteredCustomers: customers,
        });
      } else if (item.level === "province") {
        set({
          level: "province",
          selectedProvince: item.adcode,
          selectedCity: null,
          mapPlayComplete: false,
          breadcrumb: breadcrumb.slice(0, index + 1),
          filteredCustomers: filterCustomers(customers, "province", item.adcode, null),
        });
      }
    },

    selectCustomer: (customerId) => set({ selectedCustomer: customerId }),

    setMapPlayComplete: (v) => set({ mapPlayComplete: v }),

    setCustomers: (customers) =>
      set({
        customers,
        filteredCustomers: customers,
      }),
  }))
);