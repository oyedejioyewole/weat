<script lang="ts" setup>
const state = useStore();
</script>

<template>
  <div>
    <LazyResultOverview
      class="flex min-h-screen flex-col justify-between p-5 dark:bg-black md:h-screen md:w-1/4 2xl:p-10"
    />

    <LazyResultStatistics
      class="hidden w-full flex-col justify-between gap-y-10 rounded-t-3xl bg-[--md-sys-color-primary-container] py-10 md:flex md:w-3/4 md:justify-around md:rounded-t-none md:py-0 lg:rounded-l-3xl"
    />

    <div class="absolute bottom-7 right-7 grid gap-4 md:hidden">
      <!-- Settings -->
      <md-fab lowered @click="useModal('search')">
        <LazyPhosphorIconMagnifyingGlass slot="icon" />
      </md-fab>

      <!-- Overview -->
      <md-fab lowered @click="state.currentView = 'statistics'">
        <LazyPhosphorIconCloud slot="icon" />
      </md-fab>
    </div>
  </div>
</template>
