<script setup lang="ts">
const settings = useSettings();
const { $toast } = useNuxtApp();

watch(
  settings,
  (_new, _old) => {
    $toast.message("Tip", {
      description: "After changing some settings, a reload is required",
    });
  },
  { deep: true },
);
</script>

<template>
  <div class="space-y-5 2xl:space-y-10">
    <ul class="space-y-6">
      <li class="flex items-center justify-between">
        <label class="2xl:text-2xl" for="geolocation-switch"
          >Use your precise location</label
        >
        <md-switch
          icons
          id="geolocation-switch"
          @click="
            settings.features.geolocation = !settings.features.geolocation
          "
          :selected="settings.features.geolocation"
        ></md-switch>
      </li>

      <li
        class="flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center"
      >
        <label>Unit system</label>
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
  </div>
</template>
