<script setup lang="ts">
const settings = useSettings();
const state = useStore();

const location = ref("");
const loadingSearchResults = ref(false);

const { data: searchResults } = useNuxtData<Responses["search"]>("search");

const findWeather = async (latitude: number, longitude: number) => {
  useModal("search", { opened: false });
  clearNuxtData("search");

  location.value = "";
  state.value.hasForecastLoaded = false;
  clearNuxtData("forecast");

  await useGetForecast({ latitude, longitude }, settings.value.unit);

  const { data: forecastResponse } =
    useNuxtData<Responses["forecast"]>("forecast");
  if (!forecastResponse.value) return;

  state.value.hasForecastLoaded = true;
};

const searchForCity = async (location: string) => {
  await useSearch(location);
  loadingSearchResults.value = true;
};
</script>

<template>
  <div class="mx-auto space-y-10" v-auto-animate>
    <!-- Search form -->
    <form
      class="flex items-center"
      id="search-form"
      @submit.prevent="searchForCity(location)"
    >
      <PhosphorIconMagnifyingGlass size="30" />
      <input
        class="w-full bg-inherit px-5 outline-none 2xl:text-lg"
        placeholder="e.g. Washington"
        type="text"
        v-model="location"
      />
    </form>

    <!-- Loading (spinner) -->
    <div class="text-center" v-if="loadingSearchResults">
      <md-circular-progress indeterminate />
    </div>

    <div v-else-if="searchResults">
      <!-- Search results (not empty) -->
      <md-list v-if="searchResults.length > 0" class="rounded-md p-0">
        <md-list-item
          class="transition hover:bg-brand/10"
          type="button"
          v-for="(location, index) of searchResults"
          :class="{
            'rounded-t-md': index === 0,
            'rounded-b-md': index === searchResults.length - 1,
          }"
          :key="index"
          @click="findWeather(location.latitude, location.longitude)"
        >
          <h1 slot="headline" class="2xl:text-lg">{{ location.name }}</h1>
          <p slot="supporting-text" class="2xl:text-md text-sm">
            {{ location.country }}
          </p>
          <LazyPhosphorIconCaretRight size="22" slot="end" />
        </md-list-item>
      </md-list>

      <!-- Search results (empty) -->
      <div v-else class="space-y-2">
        <LazyPhosphorIconMapTrifold class="mx-auto block" size="70" />
        <h1 class="text-md text-center 2xl:text-2xl">
          Oops, couldn't find city/location
        </h1>
      </div>
    </div>
  </div>
</template>
