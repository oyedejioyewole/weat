<template>
  <md-outlined-text-field
    label="Minutes"
    type="number"
    @input="
      useChangeAutoRefreshInterval({
        minutes: parseInt($event.target.value) || 0,
      })
    "
  />
</template>
