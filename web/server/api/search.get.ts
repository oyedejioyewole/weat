import { z } from "zod";

const validateRequest = (payload: {}) => {
  const schema = z
    .object({
      location: z.string(),
      limit: z.coerce.number().min(1).max(5),
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const { limit, location } = validateRequest(query);
  const { openweathermap } = useRuntimeConfig();

  const geocodingResults = await $fetch<OpenWeatherMapResponses["geocoding"]>(
    `/geo/1.0/direct`,
    {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        limit,
        q: location,
      },
      onResponse: async ({ response }) => {
        if ((response._data as []).length === 0) {
          throw createError({
            message: "Oops, couldn't find location searched for",
            stack: "",
            statusCode: 404,
          });
        }
      },
    },
  );

  return geocodingResults.map(({ lat, lon, country, name, state }) => ({
    country: new Intl.DisplayNames(["en"], { type: "region" }).of(country),
    latitude: lat,
    longitude: lon,
    name,
    state,
  }));
});
