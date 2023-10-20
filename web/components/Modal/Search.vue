<script setup lang="ts">
const settings = useSettings();

const location = ref("");
const loadingSearchResults = ref(false);

const { data: searchResults } = useNuxtData<Responses["search"]>("search");

const findWeather = async (
  payload: { latitude: number; longitude: number },
  unit: Options["units"],
) => {
  useModal("search", { opened: false });
  clearNuxtData("search");

  location.value = "";
  clearNuxtData("forecast");

  await useGetForecast(settings.value.numberOfForecasts, payload, unit);
};

const searchForCity = async (payload: { limit: number; location: string }) => {
  loadingSearchResults.value = true;
  await useSearch(payload);
  loadingSearchResults.value = false;
};
</script>

<template>
  <div>
    <!-- Search form -->
    <form
      class="flex items-center"
      id="search-form"
      @submit.prevent="
        searchForCity({ limit: settings.numberOfCities, location })
      "
    >
      <LazyPhosphorIconMagnifyingGlass size="30" />
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
      <md-list class="rounded-md p-0" v-if="searchResults.length > 0">
        <md-list-item
          class="transition hover:bg-brand/10"
          type="button"
          v-for="(location, index) of searchResults"
          :class="{
            'rounded-t-md': index === 0,
            'rounded-b-md': index === searchResults.length - 1,
          }"
          :key="index"
          @click="
            findWeather(
              { latitude: location.latitude, longitude: location.longitude },
              settings.unit,
            )
          "
        >
          <h1 slot="headline" class="2xl:text-lg">{{ location.name }}</h1>
          <p slot="supporting-text" class="2xl:text-md text-sm">
            {{ location.country }}
            {{ location.state ? "- " + location.state : "" }}
          </p>
          <LazyPhosphorIconCaretRight size="22" slot="end" />
        </md-list-item>
      </md-list>

      <!-- Search results (empty) -->
      <div class="space-y-2" v-else>
        <LazyPhosphorIconMapTrifold class="mx-auto block" size="70" />
        <h1 class="text-md text-center 2xl:text-2xl">
          Oops, couldn't find city/location
        </h1>
      </div>
    </div>
  </div>
</template>
