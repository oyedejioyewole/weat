<script lang="ts" setup>
import addDays from "date-fns/addDays";
import differenceInHours from "date-fns/differenceInHours";
import formatDuration from "date-fns/formatDuration";
import millisecondsToSeconds from "date-fns/millisecondsToSeconds";
import parse from "date-fns/parse";

const settings = useSettings();

const showAutoReloadOnSettingsChangeAdvancedOptions = ref(false);
const input = ref<HTMLInputElement>();

const startTime = useDateFormat(new Date(), "HH:mm");

const onInput = (
  event: InputEvent,
  type: "searchResults" | "numberOfForecasts",
) => {
  if (type === "searchResults") {
    if (input.value) {
      const valid = input.value.reportValidity();

      if (valid)
        settings.value.numberOfCities =
          parseInt((event.target as HTMLInputElement).value) || 1;
    }
  } else {
    const [startTimeHour] = startTime.value.split(":");
    const [endTimeHour] = (event.target as HTMLInputElement).value.split(":");

    const endTime = addDays(
      parse((event.target as HTMLInputElement).value, "HH:mm", new Date()),
      startTimeHour > endTimeHour || startTimeHour === endTimeHour ? 1 : 0,
    );

    const hourDifference = differenceInHours(new Date(), endTime);

    settings.value.numberOfForecasts = Math.abs(Math.floor(hourDifference / 3));
  }
};
</script>

<template>
  <ul>
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

      <md-text-button
        @click="
          showAutoReloadOnSettingsChangeAdvancedOptions =
            !showAutoReloadOnSettingsChangeAdvancedOptions
        "
      >
        View
        {{ showAutoReloadOnSettingsChangeAdvancedOptions ? "less" : "more" }}
      </md-text-button>

      <div
        class="flex flex-col items-end gap-y-4"
        v-show="showAutoReloadOnSettingsChangeAdvancedOptions"
      >
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

        <p v-once>
          Current:
          {{
            formatDuration({
              seconds: millisecondsToSeconds(
                settings.features.autoReloadOnSettingsChange.timeout,
              ),
            })
          }}
        </p>
      </div>
    </li>

    <!-- Number of search results for city search -->
    <li class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="w-1/2 space-y-4">
          <label>
            How many results do you want to see when you search for city?
          </label>
          <p class="inline-flex items-center gap-x-4">
            <PhosphorIconLightbulb size="22" />Search results here are limited
            to 3
          </p>
        </div>

        <div class="space-y-4">
          <md-outlined-text-field
            label="No."
            min="1"
            max="3"
            ref="input"
            type="number"
            @input="onInput($event, 'searchResults')"
          />
          <p class="text-right">Current: {{ settings.numberOfCities }}</p>
        </div>
      </div>
    </li>

    <li class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="w-1/2 space-y-4">
          <label>How many forecasts do you want to see?</label>
          <p class="inline-flex items-center gap-x-4">
            <PhosphorIconLightbulb size="22" /> Forecasts are gotten in 3 hour
            intervals
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex gap-x-4">
            <md-outlined-text-field
              type="time"
              label="Start"
              disabled
              :value="startTime"
            />
            <md-outlined-text-field
              type="time"
              label="End"
              @input="onInput($event, 'numberOfForecasts')"
            />
          </div>
          <p class="float-right">Current: {{ settings.numberOfForecasts }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
