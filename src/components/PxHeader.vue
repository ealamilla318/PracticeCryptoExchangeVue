<template>
  <header class="shadow w-screen">
    <nav>
      <nav class="flex items-center justify-between flex-wrap bg-green-400 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <PxIcon class="w-5 h-5" />
          <router-link to="/" class="font-semibold text-xl tracking-tight"
            >Crypto-Exchange</router-link
          >
        </div>
        <div
          class="hidden sm:block w-full blok flex-grow lg:flex lg:items-center lg:wauto"
        >
          <div class="text-sm lg:flex-grow">
            <router-link
              v-for="l in links"
              :key="l.title"
              :to="l.to"
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
              >{{ l.title }}</router-link
            >
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
import PxIcon from "./PxIcon.vue";
export default {
  name: "PxHeader",
  components: { PxIcon },
  setup() {},
  props: {
    links: {
      default: () => [],
      type: Array,
    },
  },
};
</script>
