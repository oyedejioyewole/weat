import { InternalApi } from "nitropack";

declare global {
  interface IpInfoResponse {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
    readme?: string;
  }

  interface OpenWeatherMapResponses {
    currentWeather: {
      coord: {
        lon: number;
        lat: number;
      };
      weather: {
        id: number;
        main: Options["openweathermap"]["weatherConditions"];
        description: string;
        icon: string;
      }[];
      base: string;
      main: {
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
        sea_level: number;
        grnd_level: number;
      };
      visibility: number;
      wind: {
        speed: number;
        deg: number;
        gust: number;
      };
      clouds: {
        all: number;
      };
      rain?: {
        "1h": number;
        "3h": number;
      };
      snow?: {
        "1h": number;
        "3h": number;
      };
      dt: number;
      sys: {
        type: number;
        id: number;
        message: string;
        country: string;
        sunrise: number;
        sunset: number;
      };
      id: number;
      cod: number;
      name: string;
      timezone: number;
    };
    forecast: {
      cod: string;
      message: number;
      cnt: number;
      list: {
        dt: number;
        main: {
          temp: number;
          feels_like: number;
          temp_min: number;
          temp_max: number;
          pressure: number;
          sea_level: number;
          grnd_level: number;
          humidity: number;
          temp_kf: number;
        };
        weather: {
          id: string;
          main: Options["openweathermap"]["weatherConditions"];
          description: string;
          icon: string;
        }[];
        clouds: {
          all: number;
        };
        wind: {
          speed: number;
          deg: number;
          gust: number;
        };
        visibility: number;
        pop: number;
        rain: {
          "3h": number;
        };
        snow: {
          "3h": number;
        };
        sys: {
          pod: "n" | "d";
        };
        dt_txt: string;
      }[];
      city: {
        id: number;
        name: string;
        coord: {
          lat: number;
          lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
      };
    };
    geocoding: {
      name: string;
      locale_names: {
        [language: string]: string;
        ascii: string;
        feature_name: string;
      };
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }[];
    reverseGeocoding: {
      country: string;
      lat: number;
      local_names: {
        [language: string]: string;
        ascii: string;
        feature_name: string;
      };
      lon: number;
      name: string;
      state?: string;
    }[];
  }

  interface Options {
    currentView: "home" | "statistics";
    intervals: "hours" | "minutes";
    modalTypes: "search" | "settings" | "none";
    openweathermap: {
      weatherConditions:
        | "thunderstorm"
        | "drizzle"
        | "rain"
        | "snow"
        | "atmosphere"
        | "clear"
        | "clouds";
    };
    settingsView: "advanced" | "basic" | "none";
    units: "imperial" | "metric" | "standard";
  }

  interface Responses {
    forecast: InternalApi["/api/forecast"]["post"];
    currentIp: string;
    search: InternalApi["/api/search"]["get"];
  }
}

export {};
