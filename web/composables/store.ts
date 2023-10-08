import { useStorage } from "@vueuse/core";

export const useStore = () =>
  useState<{
    loadingStates: { main: boolean; search: boolean };
    modal: { type: Options["modalTypes"]; opened: boolean };
  }>("state", () => ({
    loadingStates: {
      main: true,
      search: false,
    },
    modal: { type: "search", opened: false },
  }));

export const useSettings = () =>
  useStorage("settings", {
    unit: "metric" as Options["units"],
    features: { geolocation: false },
  });
