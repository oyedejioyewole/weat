export const __weather = async (
  latitude: number,
  longitude: number,
  unit: Options["units"],
) => {
  const { openweathermap } = useRuntimeConfig();
  return await $fetch<OpenWeatherMapResponses["currentWeather"]>(
    "/data/2.5/weather",
    {
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
    },
  );
};

export const __appendUnit = (
  type: "speed" | "percentage" | "pressure" | "temperature" | "custom",
  value: unknown,
  unit?: Options["units"] | string,
) => {
  if (type === "speed")
    return `${value} ${unit === "imperial" ? "mph" : "m/s"}`;
  else if (type === "percentage") return `${value}%`;
  else if (type === "temperature")
    return `${value}${unit === "standard" ? "K" : "°"}`;
  else if (type === "custom") return `${value}${unit}`;
};
