<script lang="ts" setup>
const { data: weatherInformation } =
  useNuxtData<Responses["forecast"]>("forecast");

const { width } = useWindowSize();
</script>

<template>
  <section v-if="weatherInformation">
    <!-- City name, date -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="font-serif text-2xl 2xl:text-4xl">
          {{ weatherInformation.metadata.name }}
        </h1>
        <p class="text-[13px] 2xl:text-2xl">
          {{ weatherInformation.metadata.country }}
        </p>
      </div>
      <md-filled-tonal-icon-button
        @click="width >= 768 ? useModal('search') : useModal('settings')"
        id="action-button"
      >
        <LazyPhosphorIconMagnifyingGlass class="hidden md:block" />
        <LazyPhosphorIconGear class="block md:hidden" />
      </md-filled-tonal-icon-button>
    </div>

    <!-- Weather icon -->
    <NuxtImg
      class="mx-auto transition"
      height="208"
      sizes="208px 2xl:500px"
      width="208"
      :alt="weatherInformation.weather.description"
      :src="`https://openweathermap.org/img/wn/${weatherInformation.weather.iconId}@4x.png`"
    />

    <!-- Temperature & weather description -->
    <div>
      <h3 class="font-serif text-6xl lg:text-8xl 2xl:text-[150px]">
        {{ weatherInformation.temperature.current }}
      </h3>
      <p class="lg:text-lg 2xl:text-2xl">
        {{ weatherInformation.weather.description }}
      </p>
    </div>
  </section>
</template>

<style scoped>
@media screen and (max-width: 767px) {
  #action-button {
    --md-filled-tonal-icon-button-container-width: 50px;
    --md-filled-tonal-icon-button-container-height: 50px;
  }
}

@media screen and (min-width: 768px) {
  #action-button {
    --md-filled-tonal-icon-button-container-width: 60px;
    --md-filled-tonal-icon-button-container-height: 60px;
    --md-filled-tonal-icon-button-icon-size: 20px;
  }
}

@media screen and (min-width: 1536px) {
  #action-button {
    --md-filled-tonal-icon-button-container-width: 75px;
    --md-filled-tonal-icon-button-container-height: 75px;
    --md-filled-tonal-icon-button-icon-size: 30px;
  }
}
</style>
