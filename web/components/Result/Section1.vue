<script lang="ts" setup>
const emit = defineEmits<{
  (event: "open-modal", type: Options["modalTypes"]): void;
}>();

const { data: weatherInformation } =
  useNuxtData<Responses["forecast"]>("forecast");
</script>

<template>
  <section
    class="flex min-h-screen flex-col justify-between p-5 dark:bg-black md:h-screen md:w-1/4 2xl:p-10"
    v-if="weatherInformation"
  >
    <!-- City name, date -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="font-serif text-2xl 2xl:text-4xl">
          {{ weatherInformation.metadata.name }}
        </h1>
        <p class="text-[13px] 2xl:text-2xl">
          {{ weatherInformation.for }}
        </p>
      </div>
      <md-filled-tonal-icon-button @click="emit('open-modal', 'search')">
        <LazyPhosphorIconMagnifyingGlass />
      </md-filled-tonal-icon-button>
    </div>

    <!-- Weather icon -->
    <LazyNuxtImg
      :alt="weatherInformation.weather.description"
      :src="`https://openweathermap.org/img/wn/${weatherInformation.weather.iconId}@4x.png`"
      class="mx-auto"
      height="208"
      sizes="208px 2xl:500px"
      width="208"
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
