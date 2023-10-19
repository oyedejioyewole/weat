<script setup lang="ts">
const { $toast } = useNuxtApp();
const settings = useSettings();

const settingsView = ref<"basic" | "advanced">("basic");

watchDebounced(
  settings,
  (_new, _old) => {
    if (_new.numberOfCities !== _old.numberOfCities) {
      $toast.message("Info", { description: "Settings have been saved!" });
      return;
    }

    if (_new.features.autoReloadOnSettingsChange.enabled) {
      $toast.message("Info", {
        description: "Reloading the page",
      });
      window.location.reload();
    } else
      $toast.message("Tip", {
        description: "A manual reload is required to apply changes",
      });
  },
  {
    debounce: settings.value.features.autoReloadOnSettingsChange.timeout,
    maxWait: settings.value.features.autoReloadOnSettingsChange.timeout + 1000,
    deep: true,
  },
);
</script>

<template>
  <div class="space-y-5" v-auto-animate>
    <ModalSettingsBasicBase class="space-y-5" v-if="settingsView === 'basic'" />
    <ModalSettingsAdvanced class="space-y-5" v-else />

    <md-filled-button
      @click="settingsView = settingsView === 'advanced' ? 'basic' : 'advanced'"
    >
      {{ settingsView === "advanced" ? "Go back" : "Advanced" }}
    </md-filled-button>
  </div>
</template>
