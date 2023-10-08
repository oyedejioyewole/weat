import { z } from "zod";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const schema = z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      unit: z.enum(["metric", "imperial", "standard"]),
    })
    .strict();

  const response = schema.safeParse(body);

  if (!response.success)
    throw createError({
      message: "Oops, validation failed",
      statusCode: 400,
      stack: "",
    });

  const { openweathermap } = useRuntimeConfig();
  const { latitude, longitude, unit } = response.data;

  const forecast = await $fetch<OpenWeatherMapResponses["forecast"]>(
    `/data/2.5/forecast`,
    {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        lat: latitude,
        lon: longitude,
        units: unit,
        cnt: 8,
      },
    },
  );

  return processResponse(forecast, response.data.unit);
});
