import { z } from "zod";

const validateRequest = (payload: {}) => {
  const schema = z
    .object({
      count: z.coerce.number().min(1).max(8),
      ip: z.string().ip(),
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const { count, ip, unit } = validateRequest(query);
  const { ipinfo } = useRuntimeConfig();

  const ipResponse = await $fetch<IpInfoResponse>(ip, {
    baseURL: ipinfo.base,
    query: {
      token: ipinfo.token,
    },
  });

  const [latitude, longitude] = ipResponse.loc.split(",");

  return $fetch("/api/forecast", {
    body: {
      count,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      unit,
    },
    method: "POST",
  });
});
