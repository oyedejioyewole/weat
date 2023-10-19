<script setup lang="ts">
const state = useStore();

const whenClosed = () => {
  useModal("search", { opened: false });

  // Clear cached search response
  clearNuxtData("search");
};
</script>

<template>
  <md-dialog
    class="w-3/4 rounded-md lg:w-1/2 2xl:w-1/4"
    :open="state.modal.opened && state.modal.type !== 'none'"
    @closed="whenClosed"
  >
    <!-- Title -->
    <h1
      class="font-serif"
      slot="headline"
      v-show="state.modal.type === 'settings'"
    >
      Settings
    </h1>

    <!-- Content -->
    <div slot="content">
      <ModalSearch
        class="mx-auto space-y-10"
        v-auto-animate
        v-if="state.modal.type === 'search'"
      />
      <ModalSettingsBase v-else />
    </div>

    <!-- Action button -->
    <div slot="actions">
      <md-filled-button
        form="search-form"
        type="submit"
        v-show="state.modal.type === 'search'"
        >Search</md-filled-button
      >
    </div>
  </md-dialog>
</template>
