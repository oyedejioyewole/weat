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
      class="flex flex-none basis-1/4 flex-col justify-between bg-white p-5 dark:bg-black 2xl:p-10"
    >
      <!-- City name & date -->
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="font-serif text-2xl 2xl:text-4xl">
            {{ weatherInformation.metadata.name }}
          </h1>
          <p class="text-sm 2xl:text-2xl">{{ weatherInformation.for }}</p>
        </div>
        <!-- <button type="button" @click="openModal('search')">
          
        </button> -->
        <md-filled-tonal-icon-button @click="openModal('search')">
          <LazyPhosphorIconMagnifyingGlass />
        </md-filled-tonal-icon-button>
      </div>

      <!-- Weather icon -->
      <LazyNuxtImg
        :src="`https://openweathermap.org/img/wn/${weatherInformation.weather.iconId}@4x.png`"
        class="mx-auto w-52 2xl:w-[500px]"
      />

      <!-- Temperature & weather description -->
      <div>
        <h3 class="font-serif text-8xl 2xl:text-[150px]">
          {{ weatherInformation.temperature.current }}
        </h3>
        <p class="text-lg 2xl:text-2xl">
          {{ weatherInformation.weather.description }}
        </p>
      </div>
    </section>

    <!-- 2nd section -->
    <section
      class="flex w-3/4 flex-auto flex-col justify-around bg-[--md-sys-color-primary-container] px-24 pt-10"
    >
      <!-- <button type="button" class="ml-auto" @click="openModal('settings')">
      </button> -->

      <!-- <md-filled-tonal-icon-button
        @click="openModal('settings')"
        class="ml-auto"
      >
        <LazyPhosphorIconGear />
      </md-filled-tonal-icon-button> -->
      <!-- Forecast section -->
      <div class="space-y-3">
        <h1 class="text-xl 2xl:text-3xl">Forecast</h1>

        <Swiper
          :slides-per-view="2"
          :grab-cursor="true"
          :centered-slides="true"
          :space-between="30"
          class="select-none"
        >
          <!-- Forecast -->
          <SwiperSlide
            class="flex flex-col justify-around rounded-2xl bg-white/50 p-5 backdrop-blur-lg 2xl:space-y-36 2xl:p-10"
            v-for="(forecast, index) of weatherInformation.forecast"
            :key="index"
          >
            <!-- Time -->
            <h2
              v-if="typeof forecast.for === 'string'"
              class="font-serif 2xl:text-2xl"
            >
              {{ forecast.for }}
            </h2>
            <div v-else class="text-sm 2xl:text-2xl">
              <h2>{{ forecast.for.day }}</h2>
              <p class="font-serif">{{ forecast.for.time }}</p>
            </div>

            <div class="float-right flex items-center">
              <!-- Weather icon -->
              <NuxtImg
                :src="`https://openweathermap.org/img/wn/${forecast.weather.iconId}@4x.png`"
                :alt="`${forecast.weather.description}`"
                class="aspect-square w-14 2xl:w-36"
                loading="lazy"
              />

              <!-- Temperature -->
              <p class="font-serif text-lg 2xl:text-5xl">
                {{ forecast.temperature }}
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Atmosphere section -->
      <div class="space-y-3">
        <h1 class="text-xl 2xl:text-3xl">Atmosphere</h1>

        <Swiper
          :slides-per-view="2"
          :grab-cursor="true"
          :centered-slides="true"
          :space-between="30"
          class="select-none"
        >
          <!-- Clouds -->
          <SwiperSlide
            class="flex flex-col justify-around rounded-2xl bg-white/50 p-5 backdrop-blur-lg 2xl:space-y-36 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-2 2xl:text-2xl">
              Clouds
              <LazyPhosphorIconCloud class="text-2xl 2xl:text-3xl" />
            </h2>

            <p class="float-right font-serif text-lg 2xl:text-4xl">
              {{ weatherInformation.cloudiness }}
            </p>
          </SwiperSlide>

          <!-- Humidity (if any) -->
          <SwiperSlide
            class="flex flex-col justify-around rounded-2xl bg-white/50 p-5 backdrop-blur-lg 2xl:space-y-36 2xl:p-10"
            v-if="weatherInformation.humidity"
          >
            <h2 class="flex items-center gap-x-1 2xl:text-2xl">
              Humidity
              <LazyPhosphorIconDropHalfBottom class="text-2xl 2xl:text-3xl" />
            </h2>

            <p class="float-right font-serif text-lg 2xl:text-4xl">
              {{ weatherInformation.humidity }}
            </p>
          </SwiperSlide>

          <!-- Pressure (if any) -->
          <SwiperSlide
            class="flex flex-col justify-around rounded-2xl bg-white/50 p-5 backdrop-blur-lg 2xl:space-y-36 2xl:p-10"
            v-if="weatherInformation.pressure"
          >
            <h2>Pressure</h2>

            <p class="float-right font-serif text-lg 2xl:text-4xl">
              <span class="font-serif">{{ weatherInformation.pressure }}</span>
              hPa
            </p>
          </SwiperSlide>

          <!-- Visibility -->
          <SwiperSlide
            class="flex flex-col justify-around rounded-2xl bg-white/50 p-5 backdrop-blur-lg 2xl:space-y-36 2xl:p-10"
          >
            <h2 class="flex items-center gap-x-2 2xl:text-2xl">
              Visibility
              <LazyPhosphorIconEye class="text-2xl 2xl:text-3xl" />
            </h2>

            <p class="float-right font-serif text-lg 2xl:text-4xl">
              {{ weatherInformation.visibility }} km
            </p>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Feels like, wind, sunrise & sunset section -->
      <div class="flex items-center gap-x-3">
        <!-- Feels like & wind -->
        <ul class="flex basis-1/2 flex-col items-center space-y-3">
          <li
            class="flex w-full items-center justify-between rounded-md bg-white/40 p-3 2xl:w-1/2 2xl:p-10"
          >
            <h1 class="2xl:text-xl">Feels like:</h1>
            <p class="font-serif 2xl:text-2xl">
              {{ weatherInformation.temperature.feelsLike }}
            </p>
          </li>
          <li
            class="w-full space-y-2 rounded-md bg-white/40 p-3 2xl:w-3/4 2xl:p-10"
          >
            <h1 class="2xl:text-2xl">Wind</h1>
            <ul class="space-y-1">
              <li class="flex items-center justify-between">
                <h1 class="text-sm 2xl:text-xl">Direction:</h1>
                <Tippy>
                  <LazySvgoCompass
                    class="w-7 2xl:w-10"
                    :style="`transform: rotate(${
                      weatherInformation.wind.degree + 90
                    }deg);`"
                  />

                  <template #content>
                    <span class="font-serif">{{
                      `${weatherInformation.wind.degree}°`
                    }}</span>
                  </template>
                </Tippy>
              </li>
              <li class="flex items-center justify-between">
                <h1 class="text-sm 2xl:text-xl">Gust:</h1>
                <p class="font-serif 2xl:text-2xl">
                  {{ weatherInformation.wind.gust }}
                </p>
              </li>
              <li class="flex items-center justify-between">
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
        <ul class="flex basis-1/2 flex-col items-center space-y-3">
          <li
            class="flex w-full items-center justify-between rounded-md bg-white/40 p-3 2xl:w-1/2 2xl:p-10"
          >
            <h1 class="2xl:text-xl">Sunrise:</h1>
            <p class="font-serif 2xl:text-2xl">
              {{ weatherInformation.sunrise }}
            </p>
          </li>
          <li
            class="flex w-full items-center justify-between rounded-md bg-white/40 p-3 2xl:w-1/2 2xl:p-10"
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
