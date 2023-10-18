<script lang="ts" setup>
const input = ref({
  hours: 0,
  minutes: 0,
});

watch(input, (_new) => useChangeAutoRefreshInterval(_new), { deep: true });
</script>

<template>
  <div>
    <md-outlined-text-field
      label="Hour(s)"
      max="23"
      type="number"
      :value="input.hours"
      @input="input.hours = parseInt(($event.target as HTMLInputElement).value)"
    />
    <md-outlined-text-field
      label="Minute(s)"
      max="59"
      type="number"
      :value="input.minutes"
      @input="
        input.minutes = parseInt(($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>
