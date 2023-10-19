import { useStorage } from "@vueuse/core";

export const useStore = () =>
  useState("state", () => ({
    currentView: "home" as Options["currentView"],
    modal: { type: "search" as Options["modalTypes"], opened: false },
    tipShown: false,
  }));

export const useSettings = () =>
  useStorage("settings", {
    features: {
      autoReloadOnSettingsChange: { enabled: true, timeout: 5000 },
      autoRefresh: { enabled: true, interval: 3.6e6 },
      geolocation: false,
    },
    homeCity: null as null | { longitude: number; latitude: number },
    numberOfCities: 2,
    numberOfForecasts: 8,
    unit: "metric" as Options["units"],
  });
