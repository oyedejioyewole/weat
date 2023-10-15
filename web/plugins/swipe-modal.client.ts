import swipeModal from "@takuma-ru/vue-swipe-modal";

export default defineNuxtPlugin({
  setup: (nuxt) => {
    nuxt.vueApp.component("SwipeModal", swipeModal);
  },
});
