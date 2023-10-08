export default defineNuxtConfig({
  app: {
    rootTag: "main",
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      meta: [
        {
          name: "description",
          content: "A simple weather app!",
        },
      ],
    },
  },
  build: { transpile: ["vue-sonner"] },
  css: ["swiper/css", "tippy.js/dist/tippy.css"],
  devtools: { enabled: true },
  image: {
    domains: ["openweathermap.org"],
  },
  googleFonts: {
    display: "swap",
    families: {
      Roboto: [400, 500, 700],
    },
    preload: true,
  },
  modules: [
    "@formkit/auto-animate/nuxt",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/html-validator",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-phosphor-icons",
    "nuxt-svgo",
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
    },
    routeRules: {
      "/api/**": {
        cors: true,
      },
    },
  },
  runtimeConfig: {
    openweathermap: {
      key: process.env.OPENWEATHERMAP_API_KEY,
      base: "https://api.openweathermap.org",
    },
    ipinfo: {
      token: process.env.IPINFO_TOKEN,
      base: "https://ipinfo.io",
    },
  },
  svgo: {
    defaultImport: "component",
  },
  typescript: {
    shim: false,
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("md-"),
    },
  },
});
