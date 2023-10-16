<script lang="ts" setup>
import "@material/web/button/filled-button";
import "@material/web/button/filled-tonal-button";
import "@material/web/button/text-button";
import "@material/web/dialog/dialog";
import "@material/web/fab/fab";
import "@material/web/iconbutton/filled-tonal-icon-button";
import "@material/web/iconbutton/icon-button";
import "@material/web/list/list";
import "@material/web/list/list-item";
import "@material/web/progress/circular-progress";
import "@material/web/switch/switch";

const { $toast } = useNuxtApp();
const state = useStore();

const { data: forecastResponse } =
  useNuxtData<Responses["forecast"]>("forecast");

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
    await useGetForecast(currentIp.value, settings.value.unit);

  if (forecastResponse.value) state.value.loading.main = false;
});

watchEffect(() => {
  if (state.value.loading.main) useHead({ title: "Loading ..." });
  else if (forecastResponse.value)
    useHead({ title: `${forecastResponse.value.metadata.name} - Readings` });
  else useHead({ title: "" });
});
</script>

<template>
  <ClientOnly>
    <div v-auto-animate>
      <div
        v-if="state.loading.main"
        class="flex h-screen flex-col items-center justify-center gap-y-4 will-change-contents"
      >
        <SvgoIconRaw
          class="mx-auto w-20 animate-bounce drop-shadow-lg md:w-24"
          role="img"
          aria-label="App icon"
        />
        <p class="md:text-lg">Loading, hang tight ...</p>
      </div>

      <LazyResultBase
        v-else-if="!state.loading.main && state.currentView === 'home'"
        class="flex flex-col md:flex-row"
      />

      <LazyResultStatistics
        v-else-if="!state.loading.main && state.currentView === 'statistics'"
        class="flex flex-col justify-between gap-y-10 bg-[--md-sys-color-primary-container] py-10 md:w-3/4 md:justify-around md:py-0"
      />
    </div>
    <LazyModalBase />

    <!-- Toast -->
    <Toast position="bottom-center" rich-colors />
  </ClientOnly>
</template>

<style>
:root {
  --md-ref-typeface-plain: "Roboto";
}
</style>
