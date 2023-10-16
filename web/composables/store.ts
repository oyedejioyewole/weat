import { useStorage } from "@vueuse/core";

export const useStore = () =>
  useState("state", () => ({
    loading: {
      main: true,
      search: false,
    },
    modal: { type: "search" as Options["modalTypes"], opened: false },
    tipShown: false,
  }));

export const useSettings = () =>
  useStorage("settings", {
    unit: "metric" as Options["units"],
    features: { geolocation: false },
  });
