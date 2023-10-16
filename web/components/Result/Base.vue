<script setup lang="ts">
const state = useStore();

const keys = useMagicKeys();
const shiftS = keys["Shift+S"];

const isOverviewOpen = computed(() =>
  state.value.modal.type === "overview" ? true : false,
);

whenever(shiftS, () => useModal("settings"));
</script>

<template>
  <div>
    <!-- 1st section -->
    <ResultSection1 />

    <!-- Floating action buttons -->
    <div class="absolute bottom-7 right-7 grid gap-4 md:hidden">
      <!-- Settings -->
      <md-fab lowered @click="useModal('settings')">
        <LazyPhosphorIconGearSix slot="icon" />
      </md-fab>

      <!-- Overview -->
      <md-fab lowered @click="useModal('overview')">
        <LazyPhosphorIconCloud slot="icon" />
      </md-fab>
    </div>

    <!-- 2nd section -->
    <ResultSection2
      class="hidden w-full flex-col justify-between gap-y-10 rounded-t-3xl bg-[--md-sys-color-primary-container] py-10 md:flex md:w-3/4 md:justify-around md:rounded-t-none md:py-0 lg:rounded-l-3xl"
    />

    <!-- Overview drawer -->
    <SwipeModal
      contents-color="#d9e2ff"
      v-model="isOverviewOpen"
      :fullscreen="true"
      :persistent="true"
      :no-tip="true"
    >
      <ResultSection2 class="space-y-10 py-10" />
    </SwipeModal>
  </div>
</template>
