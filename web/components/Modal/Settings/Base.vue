<script setup lang="ts">
import millisecondsToHours from "date-fns/millisecondsToHours";
import millisecondsToMinutes from "date-fns/millisecondsToMinutes";

const { $toast } = useNuxtApp();
const settings = useSettings();

const intervalType = ref<Options["intervals"]>("hours");
const previousInterval = settings.value.features.autoRefresh.interval;

watch(
  settings,
  (_new) => {
    if (_new.features.autoReloadOnSettingsChange.enabled) {
      $toast.message("Info", {
        description: `Reloading in the next ${
          _new.features.autoReloadOnSettingsChange.timeout / 1000
        } seconds`,
      });

      useTimeoutFn(
        () => window.location.reload(),
        _new.features.autoReloadOnSettingsChange.timeout,
      );
    } else {
      $toast.message("Tip", {
        description: "A manual reload is required to apply changes",
      });
    }
  },
  { deep: true },
);
</script>

<template>
  <ul class="space-y-5">
    <!-- Auto update weather forecast (switch) -->
    <li class="space-y-4">
      <div class="flex items-center justify-between">
        <label>Auto update weather forecast</label>

        <md-switch
          icons
          :selected="settings.features.autoRefresh.enabled"
          @click="
            settings.features.autoRefresh.enabled =
              !settings.features.autoRefresh.enabled
          "
        />
      </div>
      <div
        class="flex items-center justify-between"
        v-show="settings.features.autoRefresh.enabled"
      >
        <div class="basis-1/2">
          <md-text-button trailing-icon @click="intervalType = 'hours'">
            hours
            <LazyPhosphorIconCheck
              slot="icon"
              v-show="intervalType === 'hours'"
            />
          </md-text-button>
          <md-text-button trailing-icon @click="intervalType = 'minutes'">
            minutes
            <LazyPhosphorIconCheck
              slot="icon"
              v-show="intervalType === 'minutes'"
            />
          </md-text-button>
        </div>

        <div class="flex basis-1/2 flex-col gap-y-4" v-auto-animate>
          <LazyModalSettingsVariantsIntervalTypeHours
            class="flex gap-x-4"
            v-show="intervalType === 'hours'"
          />

          <LazyModalSettingsVariantsIntervalTypeMinutes
            class="contents"
            v-show="intervalType === 'minutes'"
          />

          <p>
            Current:
            {{
              millisecondsToHours(previousInterval) === 0
                ? ""
                : millisecondsToHours(previousInterval) === 1
                ? "an hour"
                : `${millisecondsToHours(previousInterval)} hours`
            }}
            {{
              millisecondsToMinutes(previousInterval) % 60 > 0
                ? `${millisecondsToMinutes(previousInterval)} minutes`
                : ""
            }}
          </p>
        </div>
      </div>
    </li>

    <!-- Auto reload after saving settings (switch) -->
    <li class="space-y-4">
      <div class="flex items-center justify-between">
        <label>Auto reload after saving settings</label>
        <md-switch
          icons
          :selected="settings.features.autoReloadOnSettingsChange.enabled"
          @click="
            settings.features.autoReloadOnSettingsChange.enabled =
              !settings.features.autoReloadOnSettingsChange.enabled
          "
        />
      </div>

      <div class="flex flex-col items-end gap-y-4">
        <md-outlined-text-field
          type="number"
          min="1"
          max="100"
          step="10"
          label="Timeout"
          class="w-1/4"
          v-show="settings.features.autoReloadOnSettingsChange.enabled"
          @input="
            settings.features.autoReloadOnSettingsChange.timeout =
              parseInt(($event.target as HTMLInputElement).value) * 1000
          "
        />

        <p v-show="settings.features.autoReloadOnSettingsChange.enabled">
          Current:
          {{ settings.features.autoReloadOnSettingsChange.timeout / 1000 }}
          seconds
        </p>
      </div>
    </li>

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
