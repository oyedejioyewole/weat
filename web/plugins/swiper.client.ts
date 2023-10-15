import { Swiper, SwiperSlide } from "swiper/vue";

export default defineNuxtPlugin({
  setup: (nuxt) => {
    nuxt.vueApp.component("Swiper", Swiper);
    nuxt.vueApp.component("SwiperSlide", SwiperSlide);
  },
});
