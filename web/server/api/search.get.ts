import { z } from "zod";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const schema = z
    .object({
      location: z.string(),
    })
    .strict();

  const response = schema.safeParse(query);

  if (!response.success)
    throw createError({
      message: "Oops, validation failed",
      statusCode: 400,
      stack: "",
    });

  const { openweathermap } = useRuntimeConfig();
  const { location } = response.data;

  const locations = await $fetch<OpenWeatherMapResponses["geocoding"]>(
    `/geo/1.0/direct`,
    {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        q: location,
        limit: 2,
      },
    },
  );

  return locations.map(({ lat, lon, country, name }) => ({
    country: new Intl.DisplayNames(["en"], { type: "region" }).of(country),
    latitude: lat,
    longitude: lon,
    name,
  }));
});
