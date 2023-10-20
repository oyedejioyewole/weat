<script setup lang="ts">
const { $toast } = useNuxtApp();
const settings = useSettings();
const state = useStore();

console.log(state.value.modal);

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
    deep: true,
    maxWait: settings.value.features.autoReloadOnSettingsChange.timeout + 1000,
  },
);
</script>

<template>
  <div class="space-y-5" v-auto-animate>
    <ModalSettingsBasicBase
      class="space-y-5"
      v-if="state.modal.settingsView === 'basic'"
    />
    <ModalSettingsAdvanced
      class="space-y-5"
      v-else-if="state.modal.settingsView === 'advanced'"
    />
  </div>
</template>
