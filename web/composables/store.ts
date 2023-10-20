import { useStorage } from "@vueuse/core";

export const useStore = () =>
  useState("state", () => ({
    currentView: "home" as Options["currentView"],
    modal: {
      opened: false,
      settingsView: "basic" as Options["settingsView"],
      type: "none" as Options["modalTypes"],
    },
    tipShown: false,
  }));

export const useSettings = () =>
  useStorage("settings", {
    features: {
      autoReloadOnSettingsChange: { enabled: true, timeout: 5000 },
      autoRefresh: { enabled: true, interval: 3.6e6 },
      geolocation: false,
      homeCity: {
        enabled: true,
        city: {
          latitude: null as null | number,
          longitude: null as null | number,
          name: "",
        },
      },
    },
    numberOfCities: 3,
    numberOfForecasts: 8,
    unit: "metric" as Options["units"],
  });
