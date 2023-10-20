<script lang="ts" setup>
import formatDuration from "date-fns/formatDuration";
import millisecondsToHours from "date-fns/millisecondsToHours";
import millisecondsToMinutes from "date-fns/millisecondsToMinutes";

const settings = useSettings();

const intervalType = ref<Options["intervals"]>("hours");

const showAutoRefreshAdvancedOptions = ref(false);
const showUseHomeCityAdvancedOptions = ref(false);
const areSuggestedHomeCitiesLoading = ref(false);

const { data: searchResult } = useNuxtData<Responses["search"]>("search");

const onHomeCitySwitchInput = useDebounceFn(
  async (event: InputEvent) => {
    areSuggestedHomeCitiesLoading.value = true;
    await useSearch({
      limit: 5,
      location: (event.target as HTMLInputElement).value,
    });
    areSuggestedHomeCitiesLoading.value = false;
  },
  1500,
  { maxWait: 3000 },
);
</script>

<template>
  <ul>
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

      <md-text-button
        @click="
          showAutoRefreshAdvancedOptions = !showAutoRefreshAdvancedOptions
        "
      >
        View {{ showAutoRefreshAdvancedOptions ? "less" : "more" }}
      </md-text-button>

      <div
        class="flex items-center justify-between"
        v-show="showAutoRefreshAdvancedOptions"
      >
        <div class="basis-1/2">
          <md-text-button trailing-icon @click="intervalType = 'hours'">
            hours
            <PhosphorIconCheck slot="icon" v-show="intervalType === 'hours'" />
          </md-text-button>
          <md-text-button trailing-icon @click="intervalType = 'minutes'">
            minutes
            <PhosphorIconCheck
              slot="icon"
              v-show="intervalType === 'minutes'"
            />
          </md-text-button>
        </div>

        <div class="flex basis-1/2 flex-col gap-y-4">
          <ModalSettingsBasicVariantsIntervalTypeHours
            class="flex gap-x-4"
            v-show="intervalType === 'hours'"
          />

          <ModalSettingsBasicVariantsIntervalTypeMinutes
            class="contents"
            v-show="intervalType === 'minutes'"
          />

          <p v-once>
            Current:
            {{
              intervalType === "hours"
                ? formatDuration({
                    hours: millisecondsToHours(
                      settings.features.autoRefresh.interval,
                    ),
                    minutes:
                      millisecondsToMinutes(
                        settings.features.autoRefresh.interval,
                      ) % 60,
                  })
                : formatDuration({
                    minutes:
                      millisecondsToMinutes(
                        settings.features.autoRefresh.interval,
                      ) % 60,
                  })
            }}
          </p>
        </div>
      </div>
    </li>

    <!-- Home city -->
    <li class="space-y-4">
      <div class="flex items-center justify-between">
        <label>Use a home city, instead of approximate location</label>
        <md-switch
          icons
          :selected="settings.features.homeCity.enabled"
          @click="
            settings.features.homeCity.enabled =
              !settings.features.homeCity.enabled
          "
        />
      </div>

      <md-text-button
        class="transition"
        :class="{
          'relative before:absolute before:-top-[0.1rem] before:right-0 before:aspect-square before:w-[0.6rem] before:animate-pulse before:rounded-full before:bg-[--md-sys-color-primary]':
            !settings.features.homeCity.city.latitude &&
            !settings.features.homeCity.city.longitude &&
            settings.features.homeCity.enabled,
        }"
        @click="
          showUseHomeCityAdvancedOptions = !showUseHomeCityAdvancedOptions
        "
        >View more
      </md-text-button>

      <div
        class="flex items-center justify-between"
        v-show="showUseHomeCityAdvancedOptions"
      >
        <label v-once v-show="settings.features.homeCity.city.name"
          >Current: {{ settings.features.homeCity.city.name }}</label
        >
        <md-outlined-text-field
          class="ml-auto block w-[30%]"
          label="Home city"
          @input="onHomeCitySwitchInput"
        >
          <md-circular-progress
            id="loading"
            indeterminate
            slot="trailing-icon"
            v-if="areSuggestedHomeCitiesLoading"
          />
        </md-outlined-text-field>
      </div>

      <div v-if="searchResult">
        <md-chip-set>
          <md-suggestion-chip
            v-for="(result, index) of searchResult"
            @click="
              settings.features.homeCity.city = {
                latitude: result.latitude,
                longitude: result.longitude,
                name: `${result.name} in ${result.state}`,
              }
            "
            :key="index"
            :label="`${result.name} ${result.state ? '- ' + result.state : ''}`"
          ></md-suggestion-chip>
        </md-chip-set>
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
          <PhosphorIconCheck
            slot="icon"
            v-show="settings.unit === 'imperial'"
          />
        </md-text-button>
        <md-text-button trailing-icon @click="settings.unit = 'metric'">
          Metric (&deg;C)
          <PhosphorIconCheck slot="icon" v-show="settings.unit === 'metric'" />
        </md-text-button>
        <md-text-button trailing-icon @click="settings.unit = 'standard'">
          Standard (K)
          <PhosphorIconCheck
            slot="icon"
            v-show="settings.unit === 'standard'"
          />
        </md-text-button>
      </div>
    </li>
  </ul>
</template>

<style scoped>
#loading {
  --md-circular-progress-size: 30px;
}
</style>
