import { z } from "zod";

const validateRequest = (payload: {}) => {
  const schema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  });

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
  const body = await readBody(event);

  const { latitude, longitude } = validateRequest(body);
  const { openweathermap } = useRuntimeConfig();

  const city = await $fetch<OpenWeatherMapResponses["reverseGeocoding"]>(
    "/geo/1.0/reverse",
    {
      baseURL: openweathermap.base,
      query: {
        appid: openweathermap.key,
        lat: latitude,
        lon: longitude,
      },
    },
  );

  return city[0].state;
});
