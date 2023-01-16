<template>
  <main>
    <px-header :links="links" />
    <router-view class="container px-5 sm:px-20 py-20 flex justify-center" />
  </main>
</template>

<script>
import PxHeader from "./components/PxHeader.vue";

export default {
  name: "App",
  data() {
    return {
      links: [
        {
          title: "XRP",
          to: { name: "coin-detail", params: { id: "xrp" } },
        },
        {
          title: "ETH",
          to: { name: "coin-detail", params: { id: "ethereum" } },
        },
        {
          title: "BTC",
          to: { name: "coin-detail", params: { id: "bitcoin" } },
        },
      ],
    };
  },
  components: {
    PxHeader,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
