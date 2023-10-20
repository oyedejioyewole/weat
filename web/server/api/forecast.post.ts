import { format, fromUnixTime, isSameDay } from "date-fns";
import { z } from "zod";

const validateRequest = (payload: {}) => {
  const schema = z
    .object({
      count: z.number().min(1).max(8),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      unit: z.enum(["metric", "imperial", "standard"]),
    })
    .strict();

  const response = schema.safeParse(payload);

  switch (response.success) {
    case true:
      return response.data;
    case false:
      throw createError({
        message: "Oops, validation failed",
        stack: response.error.stack,
        statusCode: 400,
      });
  }
};

const processResponse = (
  currentWeather: OpenWeatherMapResponses["currentWeather"],
  forecast: OpenWeatherMapResponses["forecast"],
  unit: Options["units"],
  location?: string,
) => {
  // Get country name from its ISO code
  const country = new Intl.DisplayNames(["en"], { type: "region" }).of(
    forecast.city.country,
  );

  const sunrise = fromUnixTime(currentWeather.sys.sunrise);
  const sunset = fromUnixTime(currentWeather.sys.sunset);

  const __appendUnit = (type: "temperature" | "speed", value: string) => {
    switch (type) {
      case "temperature":
        return `${value}${unit === "standard" ? " K" : "°"}`;
      case "speed":
        return `${value} ${unit === "imperial" ? "mph" : "m/s"}`;
    }
  };

  return {
    cloudiness: `${currentWeather.clouds.all}%`,
    forecast: forecast.list.map(({ main, weather, dt }) => {
      const forecastDate = fromUnixTime(dt);
      return {
        temperature: __appendUnit("temperature", main.temp.toFixed(1)),
        weather: {
          iconId: weather[0].icon,
          description: weather[0].description.replace(/^\w/, (word) =>
            word.toUpperCase(),
          ),
        },
        for: isSameDay(forecastDate, new Date())
          ? format(forecastDate, "p")
          : {
              day: format(forecastDate, "EEEE"),
              time: format(forecastDate, "p"),
            },
      };
    }),
    humidity: currentWeather.main.humidity
      ? `${currentWeather.main.humidity}%`
      : undefined,
    metadata: {
      country,
      name: location,
    },
    pressure: currentWeather.main.grnd_level
      ? `${currentWeather.main.grnd_level} hPa`
      : undefined,
    sunrise: format(sunrise, "p"),
    sunset: format(sunset, "p"),
    temperature: {
      current: __appendUnit("temperature", currentWeather.main.temp.toFixed(1)),
      feelsLike: __appendUnit(
        "temperature",
        currentWeather.main.feels_like.toFixed(1),
      ),
    },
    visibility: currentWeather.visibility
      ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
      : undefined,
    weather: {
      iconId: currentWeather.weather[0].icon,
      description: currentWeather.weather[0].description.replace(
        /^\w/,
        (word) => word.toUpperCase(),
      ),
    },
    wind: {
      speed: currentWeather.wind.speed
        ? __appendUnit("speed", currentWeather.wind.speed.toFixed(1))
        : undefined,
      degree: currentWeather.wind.deg
        ? `${currentWeather.wind.deg}°`
        : undefined,
      gust: currentWeather.wind.gust
        ? __appendUnit("speed", currentWeather.wind.gust.toFixed(1))
        : undefined,
    },
  };
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { count, latitude, longitude, unit } = validateRequest(body);
  const { openweathermap } = useRuntimeConfig();

  const [currentWeather, forecast, location] = await Promise.all([
    // Get current weather
    $fetch<OpenWeatherMapResponses["currentWeather"]>("/data/2.5/weather", {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        lat: latitude,
        lon: longitude,
        units: unit,
      },
      onResponse: ({ response }) => {
        switch (response.status) {
          case 400:
            throw createError({
              message: "Oops, coordinates were invalid",
              statusCode: response.status,
            });
        }
      },
    }),

    // Get forecast
    $fetch<OpenWeatherMapResponses["forecast"]>(`/data/2.5/forecast`, {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        cnt: count,
        lat: latitude,
        lon: longitude,
        units: unit,
      },
    }),

    $fetch("/api/geocoder", { method: "POST", body: { latitude, longitude } }),
  ]);

  return processResponse(currentWeather, forecast, unit, location);
});
