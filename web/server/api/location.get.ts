import { z } from "zod";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const schema = z
    .object({
      ip: z.string().ip(),
      unit: z.enum(["metric", "imperial", "standard"]),
    })
    .strict();

  const response = schema.safeParse(query);

  if (!response.success)
    throw createError({ message: "Oops, validation failed", statusCode: 400 });

  const { ipinfo } = useRuntimeConfig();
  const { ip, unit } = response.data;

  const ipResponse = await $fetch<IpInfoResponse>(`/${ip}`, {
    baseURL: ipinfo.base,
    query: {
      token: ipinfo.token,
    },
  });

  const [latitude, longitude] = ipResponse.loc.split(",");

  return $fetch("/api/forecast", {
    body: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      unit,
    },
    method: "POST",
  });
});
