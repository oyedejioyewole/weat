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
    :open="state.modal.opened && state.modal.type !== 'overview'"
    @closed="whenClosed"
    class="w-3/4 overflow-hidden rounded-md px-8 py-5 lg:w-1/2 2xl:w-1/4 2xl:px-20 2xl:py-10"
  >
    <h1
      class="font-serif"
      slot="headline"
      v-show="state.modal.type === 'settings'"
    >
      Settings
    </h1>
    <div slot="content">
      <LazyModalSearch v-if="state.modal.type === 'search'" />
      <LazyModalSettings v-else-if="state.modal.type === 'settings'" />
    </div>
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
