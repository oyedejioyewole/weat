<script setup lang="ts">
const state = useStore();

const whenClosed = () => {
  state.value.modal.opened = false;

  // Clear search results
  const { data: searchResponse } = useNuxtData<Responses["search"]>("search");
  searchResponse.value = null;
};
</script>

<template>
  <md-dialog
    class="w-3/4 overflow-hidden rounded-md px-8 py-5 lg:w-1/2 2xl:w-1/4 2xl:px-20 2xl:py-10"
    :open="state.modal.opened"
    @closed="whenClosed"
  >
    <h1
      slot="headline"
      v-show="state.modal.type === 'settings'"
      class="font-serif"
    >
      Settings
    </h1>
    <div slot="content">
      <LazyModalSearch v-if="state.modal.type === 'search'" />
      <LazyModalSettings v-else-if="state.modal.type === 'settings'" />
    </div>
    <div slot="actions">
      <md-filled-button
        v-show="state.modal.type === 'search'"
        form="search-form"
        type="submit"
        >Search</md-filled-button
      >
    </div>
  </md-dialog>
</template>
