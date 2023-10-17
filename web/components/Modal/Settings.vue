<script setup lang="ts">
const { $toast } = useNuxtApp();
const settings = useSettings();

watch(
  settings,
  () =>
    $toast.message("Tip", {
      description: "After changing some settings, a reload is required",
    }),

  { deep: true },
);
</script>

<template>
  <ul class="space-y-5">
    <!-- Use precise location (switch) -->
    <li class="flex items-center justify-between">
      <label class="2xl:text-lg" for="geolocation-switch"
        >Use your precise location</label
      >
      <md-switch
        icons
        :selected="settings.features.geolocation"
        @click="settings.features.geolocation = !settings.features.geolocation"
      ></md-switch>
    </li>

    <!-- Unit system (options) -->
    <li
      class="flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center"
    >
      <label class="2xl:text-lg">Unit system</label>
      <div>
        <md-text-button trailing-icon @click="settings.unit = 'imperial'"
          >Imperial (&deg;F)
          <LazyPhosphorIconCheck
            slot="icon"
            v-show="settings.unit === 'imperial'"
          />
        </md-text-button>
        <md-text-button trailing-icon @click="settings.unit = 'metric'">
          Metric (&deg;C)
          <LazyPhosphorIconCheck
            slot="icon"
            v-show="settings.unit === 'metric'"
          />
        </md-text-button>
        <md-text-button trailing-icon @click="settings.unit = 'standard'">
          Standard (K)
          <LazyPhosphorIconCheck
            slot="icon"
            v-show="settings.unit === 'standard'"
          />
        </md-text-button>
      </div>
    </li>
  </ul>
</template>
