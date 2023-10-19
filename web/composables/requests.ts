export const useGetIp = async () => {
  await useFetch<Responses["currentIp"]>("https://api.ipify.org", {
    key: "ip",
    onRequestError: () => {
      const { $toast } = useNuxtApp();

      $toast.error("Couldn't find your location", {
        description: "Attempting again",
      });
    },
    retry: 1,
  });
};

export const useGetForecast = async (
  count: number,
  query: string | { latitude: number; longitude: number },
  unit: Options["units"],
) => {
  const { isDesktopOrTablet } = useDevice();
  const state = useStore();

  const { $toast } = useNuxtApp();

  if (typeof query === "object")
    await useFetch("/api/forecast", {
      body: {
        count,
        latitude: query.latitude,
        longitude: query.longitude,
        unit,
      },
      key: "forecast",
      method: "POST",
      onRequestError: () => {
        $toast.error("Couldn't get the weather forecast", {
          description: "Try reloading this page",
        });
      },
      retry: 1,
    });
  else
    await useFetch("/api/location", {
      key: "forecast",
      onRequestError: () => {
        $toast.error("Couldn't get the weather forecast", {
          description: "Try reloading this page",
        });
      },
      query: {
        count,
        ip: query,
        unit,
      },
      retry: 1,
    });

  if (isDesktopOrTablet && !state.value.tipShown) {
    $toast.message("Tip", {
      description: "You can use Shift + S to open the settings",
    });
    state.value.tipShown = true;
  }
};

export const useSearch = (payload: { limit: number, location: string }) =>
  useFetch("/api/search", {
    key: "search",
    onRequestError: () => {
      const { $toast } = useNuxtApp();

      $toast.error("Couldn't find location", {
        description: "Try checking your internet connection",
      });
    },
    query: { limit: payload.limit, location: payload.location },
    retry: 1,
  });
