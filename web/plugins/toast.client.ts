import { Toaster, toast } from "vue-sonner";

export default defineNuxtPlugin({
  setup: (nuxt) => {
    nuxt.vueApp.component("Toast", Toaster);

    return {
      provide: {
        toast,
      },
    };
  },
});
