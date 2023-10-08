<script lang="ts" setup>
import "@material/web/dialog/dialog";
import "@material/web/button/filled-button";
import "@material/web/button/filled-tonal-button";
import "@material/web/iconbutton/filled-tonal-icon-button";
import "@material/web/list/list";
import "@material/web/list/list-item";
import "@material/web/progress/circular-progress";
import "@material/web/switch/switch";
import "@material/web/button/text-button";

const state = useStore();
const { data: forecastResponse } =
  useNuxtData<Responses["forecast"]>("forecast");
const { $toast } = useNuxtApp();

onMounted(async () => {
  useSetTheme();

  const settings = useSettings();
  if (settings.value.features.geolocation) {
    const { isSupported, coords, error } = useGeolocation({
      enableHighAccuracy: true,
    });

    if (isSupported.value) {
      if (error.value) {
        $toast.error("Oops, an error occured (in browser)", {
          description:
            error.value.code === 1
              ? "Denied access to precise location"
              : "Unable to access the device location",
        });

        await useGetIp();
      } else {
        if (
          coords.value.latitude === Infinity ||
          coords.value.longitude === Infinity
        )
          await useGetIp();
        else
          await useGetForecast(
            {
              latitude: coords.value.latitude,
              longitude: coords.value.longitude,
            },
            settings.value.unit,
          );
      }
    } else await useGetIp();
  } else await useGetIp();

  const { data: currentIp } = useNuxtData<Responses["currentIp"]>("ip");

  if (currentIp.value)
    await useGetForecast(currentIp.value.ip, settings.value.unit);

  if (forecastResponse.value) state.value.loadingStates.main = false;
});

watchEffect(() => {
  if (state.value.loadingStates.main) useHead({ title: "Loading ..." });
  else if (forecastResponse.value)
    useHead({ title: `${forecastResponse.value.metadata.name} - Readings` });
  else useHead({ title: "" });
});
</script>

<template>
  <ClientOnly>
    <div v-auto-animate>
      <div
        v-if="state.loadingStates.main"
        class="flex h-screen flex-col items-center justify-center gap-y-4 will-change-contents"
      >
        <SvgoLogo
          class="mx-auto w-24 animate-bounce drop-shadow-lg"
          role="img"
          aria-label="App logo"
        />
        <p class="text-lg">Loading, hang tight ...</p>
      </div>

      <LazyResult v-else class="flex h-screen overflow-hidden" />
      <LazyModalBase />
    </div>
    <Toast position="bottom-center" rich-colors />
  </ClientOnly>
</template>

<style>
:root {
  --md-ref-typeface-plain: "Roboto";
}
</style>
