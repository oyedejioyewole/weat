import { format, fromUnixTime, isSameDay } from 'date-fns'


export const processResponse = async (
  apiResponse: OpenWeatherMapResponses["forecast"],
  unit: Options["units"],
) => {
  const weatherInformation = await __weather(apiResponse.city.coord.lat, apiResponse.city.coord.lon, unit)

  const country = new Intl.DisplayNames(["en"], { type: "region" }).of(
    apiResponse.city.country,
  );

  return {
    cloudiness: __appendUnit("percentage", weatherInformation.clouds.all),
    for: format(
      fromUnixTime(weatherInformation.dt),
      "EEEE, d MMMM",
    ),
    forecast: apiResponse.list.map(({ main, weather, dt }) => {
      const forecastDate = fromUnixTime(dt);
      return {
        temperature: __appendUnit("temperature", main.temp.toFixed(1), unit),
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
    humidity: __appendUnit("percentage", weatherInformation.main.humidity),
    metadata: {
      country,
      name: apiResponse.city.name,
    },
    pressure: weatherInformation.main.grnd_level,
    sunrise: format(
      fromUnixTime(weatherInformation.sys.sunrise),
      "p",
    ),
    sunset: format(
      fromUnixTime(weatherInformation.sys.sunset),
      "p",
    ),
    temperature: {
      current: __appendUnit(
        "temperature",
        weatherInformation.main.temp.toFixed(1),
        unit,
      ),
      feelsLike: __appendUnit(
        "temperature",
        weatherInformation.main.feels_like.toFixed(1),
        unit,
      ),
    },
    visibility: weatherInformation.visibility / 1000,
    weather: {
      iconId: weatherInformation.weather[0].icon,
      description: weatherInformation.weather[0].description.replace(
        /^\w/,
        (word) => word.toUpperCase(),
      ),
    },
    wind: {
      speed: weatherInformation.wind.speed
        ? __appendUnit("speed", weatherInformation.wind.speed, unit)
        : "N/A",
      degree: weatherInformation.wind.deg,
      gust: weatherInformation.wind.gust
        ? __appendUnit("speed", weatherInformation.wind.gust, unit)
        : "N/A",
    },
  };
};
