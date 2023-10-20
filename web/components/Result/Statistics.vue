<script lang="ts" setup>
const state = useStore();

const { data: weather } = useNuxtData<Responses["forecast"]>("forecast");

const { width } = useWindowSize();
</script>

<template>
  <section v-if="weather">
    <!-- Forecast group -->
    <div class="space-y-5 px-5">
      <!-- Overview (only on phones and tablets) -->
      <h1 class="inline-flex items-center gap-x-1 text-xl md:hidden">
        <md-icon-button @click="state.currentView = 'home'">
          <LazyPhosphorIconCaretLeft />
        </md-icon-button>
        Overview
      </h1>

      <!-- Heading -->
      <h2
        class="inline-flex w-full items-center justify-between text-xl 2xl:text-3xl"
      >
        Forecast

        <!-- Settings (shows only when using tablets) -->
        <md-icon-button
          @click="useModal('settings')"
          class="hidden md:flex lg:hidden"
        >
          <LazyPhosphorIconGear />
        </md-icon-button>
      </h2>

      <!-- Forecasts (swipeable) -->
      <Swiper
        class="select-none"
        :grab-cursor="true"
        :slides-per-view="width >= 1536 ? 4 : 2"
        :space-between="20"
        :modules="[SwiperScrollbar]"
        :scrollbar="{
          enabled: true,
          draggable: true,
          hide: true,
          snapOnRelease: true,
        }"
      >
        <SwiperSlide
          class="space-y-4 rounded-2xl bg-[--md-sys-color-on-primary] p-5 2xl:p-10"
          v-for="(forecast, index) of weather.forecast"
          :key="index"
        >
          <!-- Forecasted for -->
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

          <!-- Weather group -->
          <div
            class="flex flex-col items-center sm:flex-row md:float-right 2xl:gap-x-4"
          >
            <!-- Icon -->
            <LazyNuxtImg
              format="webp"
              height="56"
              sizes="2xl:144px 56px"
              width="56"
              :alt="forecast.weather.description"
              :src="`https://openweathermap.org/img/wn/${forecast.weather.iconId}@4x.png`"
            />

            <!-- Readings -->
            <p class="font-serif 2xl:text-4xl">
              {{ forecast.temperature }}
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Atmosphere group -->
    <div class="space-y-3 px-5">
      <!-- Heading -->
      <h1 class="text-xl 2xl:text-3xl">Atmosphere</h1>

      <!-- Clouds, humidity (+2 more) group -->
      <ul class="grid grid-cols-2 gap-3 md:flex">
        <!-- Clouds -->
        <li
          class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:justify-around 2xl:gap-y-4 2xl:p-6"
        >
          <h2
            class="flex items-center gap-x-1 text-sm 2xl:gap-x-2 2xl:text-2xl"
          >
            Clouds
            <LazyPhosphorIconCloud :size="width >= 1536 ? 30 : 22" />
          </h2>

          <p class="float-right font-serif 2xl:text-3xl">
            {{ weather.cloudiness }}
          </p>
        </li>

        <!-- Humidity -->
        <li
          class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:justify-around 2xl:gap-y-4 2xl:p-6"
        >
          <h2
            class="flex items-center gap-x-1 text-sm 2xl:gap-x-2 2xl:text-2xl"
          >
            Humidity
            <LazyPhosphorIconDropHalfBottom :size="width >= 1536 ? 30 : 22" />
          </h2>

          <p class="float-right font-serif 2xl:text-3xl">
            {{ weather.humidity ? weather.humidity : "N/A" }}
          </p>
        </li>

        <!-- Pressure -->
        <li
          class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:justify-around 2xl:gap-y-4 2xl:p-6"
        >
          <h2
            class="flex items-center gap-x-1 text-sm 2xl:gap-x-2 2xl:text-2xl"
          >
            Pressure
            <LazyPhosphorIconGauge :size="width >= 1536 ? 30 : 22" />
          </h2>

          <p class="font-serif 2xl:text-3xl">
            {{ weather.pressure ? weather.pressure : "N/A" }}
          </p>
        </li>

        <!-- Visibility -->
        <li
          class="flex flex-col justify-between rounded-xl bg-[--md-sys-color-on-primary] p-3 md:w-fit 2xl:justify-around 2xl:gap-y-4 2xl:p-6"
        >
          <h2
            class="flex items-center gap-x-1 text-sm 2xl:gap-x-2 2xl:text-2xl"
          >
            Visibility
            <LazyPhosphorIconEye :size="width >= 1536 ? 30 : 22" />
          </h2>

          <p class="float-right font-serif 2xl:text-3xl">
            {{ weather.visibility ? weather.visibility : "N/A" }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Feels like, wind (+2 more) group -->
    <div class="flex items-center gap-x-3 px-5 2xl:gap-x-0">
      <!-- Feels like & wind -->
      <ul class="basis-1/2 space-y-3 2xl:w-1/4 2xl:basis-auto">
        <li
          class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row lg:items-center 2xl:w-3/4 2xl:p-10"
        >
          <h1 class="2xl:text-2xl">Feels like:</h1>
          <p class="font-serif 2xl:text-3xl">
            {{ weather.temperature.feelsLike }}
          </p>
        </li>
        <li
          class="w-full space-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 2xl:w-3/4 2xl:space-y-5 2xl:p-10"
        >
          <h1 class="2xl:text-2xl">Wind</h1>
          <ul class="space-y-3">
            <li
              class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
            >
              <h1 class="text-sm 2xl:text-xl">Direction:</h1>
              <p class="font-serif 2xl:text-3xl">
                {{ weather.wind.degree ? weather.wind.degree : "N/A" }}
              </p>
            </li>
            <li
              class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
            >
              <h1 class="text-sm 2xl:text-xl">Gust:</h1>
              <p class="font-serif 2xl:text-3xl">
                {{ weather.wind.gust ? weather.wind.gust : "N/A" }}
              </p>
            </li>
            <li
              class="flex flex-col justify-between gap-y-1 md:flex-row md:items-center"
            >
              <h1 class="text-sm 2xl:text-xl">Speed:</h1>
              <p class="font-serif 2xl:text-3xl">
                {{ weather.wind.speed ? weather.wind.speed : "N/A" }}
              </p>
            </li>
          </ul>
        </li>
        <li></li>
      </ul>

      <!-- Sunrise & sunset -->
      <ul class="basis-1/2 space-y-3 2xl:w-1/4 2xl:basis-auto">
        <li
          class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row lg:items-center 2xl:p-10"
        >
          <h1 class="2xl:text-2xl">Sunrise:</h1>
          <p class="font-serif 2xl:text-3xl">
            {{ weather.sunrise }}
          </p>
        </li>
        <li
          class="flex w-full flex-col justify-between gap-y-3 rounded-xl bg-[--md-sys-color-on-primary] p-3 md:flex-row md:items-center 2xl:p-10"
        >
          <h1 class="2xl:text-2xl">Sunset:</h1>
          <p class="font-serif 2xl:text-3xl">
            {{ weather.sunset }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>
