import { Tippy } from "vue-tippy";

export default defineNuxtPlugin({
  setup: (nuxt) => {
    nuxt.vueApp.component("Tippy", Tippy);
  },
});
