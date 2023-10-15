<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";

const state = useStore();
const { data: weatherInformation } =
  useNuxtData<Responses["forecast"]>("forecast");

const openModal = (type: Options["modalTypes"]) =>
  (state.value.modal = { type, opened: true });

const keys = useMagicKeys();
const shiftS = keys["Shift+S"];

whenever(shiftS, () => openModal("settings"));
</script>

<template>
  <div v-if="weatherInformation">
    <!-- 1st section -->
    <section
      class="flex min-h-screen flex-col justify-between p-5 dark:bg-black md:h-screen md:w-1/4 2xl:p-10"
    >
      <!-- City name, date -->
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="font-serif text-2xl 2xl:text-4xl">
            {{ weatherInformation.metadata.name }}
          </h1>
          <p class="text-[13px] 2xl:text-2xl">
            {{ weatherInformation.for }}
          </p>
        </div>
        <md-filled-tonal-icon-button @click="openModal('search')">
          <LazyPhosphorIconMagnifyingGlass />
        </md-filled-tonal-icon-button>
      </div>

      <!-- Weather icon -->
      <LazyNuxtImg
        :alt="weatherInformation.weather.description"
        :src="`https://openweathermap.org/img/wn/${weatherInformation.weather.iconId}@4x.png`"
        class="mx-auto"
        height="208"
        sizes="208px 2xl:500px"
        width="208"
      />

      <!-- Temperature & weather description -->
      <div>
        <h3 class="font-serif text-6xl lg:text-8xl 2xl:text-[150px]">
          {{ weatherInformation.temperature.current }}
        </h3>
        <p class="lg:text-lg 2xl:text-2xl">
          {{ weatherInformation.weather.description }}
        </p>
      </div>
    </section>

    <!-- 2nd section -->
    <section
      class="flex w-full flex-col justify-between gap-y-10 rounded-t-3xl bg-[--md-sys-color-primary-container] py-10 md:w-3/4 md:justify-around md:rounded-t-none md:py-0 lg:rounded-l-3xl"
    >
      <!-- Forecast section -->
      <div class="space-y-3 px-5">
        <h1 class="text-xl 2xl:text-3xl">Forecast</h1>

        <Swiper
          :grab-cursor="true"
          :slides-per-view="2"
          :space-between="20"
          class="select-none"
        >
          <!-- Forecast -->
          <SwiperSlide
            class="flex flex-col rounded-2xl bg-[--md-sys-color-on-primary] p-5 md:mx-0 2xl:space-y-36 2xl:p-10"
            v-for="(forecast, index) of weatherInformation.forecast"
            :key="index"
          >
            <!-- Time -->
            <h2
              v-if="typeof forecast.for === 'string'"
              class="font-serif text-sm 2xl:text-2xl"
            >
              {{ forecast.for }}
            </h2>
            <h2 v-else class="text-sm 2xl:text-2xl">
              {{ forecast.for.day }} -
              <span class="font-serif">{{ forecast.for.time }}</span>
            </h2>

            <div class="flex flex-col items-center sm:flex-row md:float-right">
              <!-- Weather icon -->
              <LazyNuxtImg
                :alt="forecast.weather.description"
                :src="`https://openweathermap.org/img/wn/${forecast.weather.iconId}@4x.png`"
                height="56"
                sizes="xxl:144px 56px"
                width="56"
              />

              <!-- Temperature -->
              <p class="font-serif 2xl:text-5xl">
                {{ forecast.temperature }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Atmosphere section -->
      <div class="space-y-3 px-5">
        <h1 class="text-xl 2xl:text-3xl">Atmosphere</h1>

        <!-- Clouds, humidity, pressure, visibility -->
        <ul class="grid grid-cols-2 gap-3 md:flex">
          <li
            class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:w-1/2 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-1 text-sm 2xl:text-2xl">
              Clouds
              <LazyPhosphorIconCloud size="22" />
            </h2>

            <p class="float-right font-serif 2xl:text-4xl">
              {{ weatherInformation.cloudiness }}
            </p>
          </li>
          <li
            class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-1 text-sm 2xl:text-2xl">
              Humidity
              <LazyPhosphorIconDropHalfBottom size="22" />
            </h2>

            <p class="float-right font-serif 2xl:text-4xl">
              {{ weatherInformation.humidity }}
            </p>
          </li>
          <li
            class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:w-1/2 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-1 text-sm 2xl:text-2xl">
              Pressure
              <LazyPhosphorIconGauge size="22" />
            </h2>

            <p class="font-serif 2xl:text-4xl">
              {{ weatherInformation.pressure }}
              hPa
            </p>
          </li>
          <li
            class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:w-1/2 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-1 text-sm 2xl:text-2xl">
              Visibility
              <LazyPhosphorIconEye size="22" />
            </h2>

            <p class="float-right font-serif 2xl:text-4xl">
              {{ weatherInformation.visibility }} km
            </p>
          </li>
        </ul>
      </div>

      <!-- Feels like, wind, sunrise, sunset -->
      <div class="flex items-center gap-x-3 px-5">
        <!-- Feels like & wind -->
        <ul class="basis-1/2 space-y-3">
          <li
            class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row lg:items-center 2xl:w-1/2 2xl:p-10"
          >
            <h1 class="2xl:text-xl">Feels like:</h1>
            <p class="font-serif 2xl:text-2xl">
              {{ weatherInformation.temperature.feelsLike }}
            </p>
          </li>
          <li
            class="w-full space-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 2xl:w-3/4 2xl:p-10"
          >
            <h1 class="2xl:text-2xl">Wind</h1>
            <ul class="space-y-3">
              <li
                class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
              >
                <h1 class="text-sm 2xl:text-xl">Direction:</h1>
                <p class="font-serif">
                  {{ weatherInformation.wind.degree }}&deg;
                </p>
              </li>
              <li
                class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
              >
                <h1 class="text-sm 2xl:text-xl">Gust:</h1>
                <p class="font-serif 2xl:text-2xl">
                  {{ weatherInformation.wind.gust }}
                </p>
              </li>
              <li
                class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
              >
                <h1 class="text-sm 2xl:text-xl">Speed:</h1>
                <p class="font-serif 2xl:text-2xl">
                  {{ weatherInformation.wind.speed }}
                </p>
              </li>
            </ul>
          </li>
          <li></li>
        </ul>

        <!-- Sunrise & sunset -->
        <ul class="basis-1/2 space-y-3">
          <li
            class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row lg:items-center 2xl:w-1/2 2xl:p-10"
          >
            <h1 class="2xl:text-xl">Sunrise:</h1>
            <p class="font-serif 2xl:text-2xl">
              {{ weatherInformation.sunrise }}
            </p>
          </li>
          <li
            class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row md:items-center 2xl:w-1/2 2xl:p-10"
          >
            <h1 class="2xl:text-xl">Sunset:</h1>
            <p class="font-serif 2xl:text-2xl">
              {{ weatherInformation.sunset }}
            </p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
