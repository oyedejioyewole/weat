<script setup lang="ts">
const state = useStore();
const settings = useSettings();

const location = ref("");

const findWeather = async (latitude: number, longitude: number) => {
  state.value.loadingStates.main = true;
  state.value.modal.opened = false;

  location.value = "";
  searchResults.value = null;

  await useGetForecast({ latitude, longitude }, settings.value.unit);

  const { data: forecastResponse } =
    useNuxtData<Responses["forecast"]>("forecast");
  if (!forecastResponse.value) return;

  state.value.loadingStates.main = false;
};

const searchForCity = async (location: string) => {
  state.value.loadingStates.search = true;
  await useSearch(location);
  state.value.loadingStates.search = false;
};

const { data: searchResults } = useNuxtData<Responses["search"]>("search");
</script>

<template>
  <div class="mx-auto space-y-10" v-auto-animate>
    <!-- Search form -->
    <form
      class="flex items-center"
      id="search-form"
      @submit.prevent="searchForCity(location)"
    >
      <LazyPhosphorIconMagnifyingGlass size="30" />
      <input
        type="text"
        v-model="location"
        class="w-full bg-inherit px-5 outline-none 2xl:p-10 2xl:text-2xl"
        placeholder="e.g. Washington"
      />
    </form>

    <!-- Loading (if any) -->
    <div class="text-center" v-if="state.loadingStates.search">
      <md-circular-progress indeterminate />
    </div>

    <!-- Search results (if any) -->
    <div v-else-if="searchResults">
      <md-list v-if="searchResults.length > 0" class="rounded-md p-0">
        <md-list-item
          :key="index"
          class="transition hover:bg-brand/10"
          type="button"
          v-for="(location, index) of searchResults"
          @click="findWeather(location.latitude, location.longitude)"
          :class="{
            'rounded-t-md': index === 0,
            'rounded-b-md': index === searchResults.length - 1,
          }"
        >
          <h1 slot="headline" class="2xl:text-2xl">{{ location.name }}</h1>
          <p slot="supporting-text" class="text-sm 2xl:text-lg">
            {{ location.country }}
          </p>
          <LazyPhosphorIconCaretRight size="22" slot="end" />
        </md-list-item>
      </md-list>

      <div v-else class="space-y-2">
        <LazyPhosphorIconMapTrifold size="70" class="mx-auto block" />
        <h1 class="text-md text-center 2xl:text-2xl">
          Oops, couldn't find city/location
        </h1>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes spin {
  to {
    transform: rotate(-360deg);
  }
}
.spin {
  animation: spin 1s linear infinite;
}
</style>
