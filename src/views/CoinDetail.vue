<template>
  <div class="flex-col">
    <div class="flex justify-center align-center">
      <bounce-loader :loading="isLoading" :Color="'#68d391'" :size="100" />
    </div>
    <template v.if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD to ${asset.symbol}` : `${asset.symbol} to USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
              v-model="converValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                />
            </label>
          </div>

          <span class="text-xl">{{ converResult }} {{ fromUsd ? asset.symbol : 'USD' }}</span>
        </div>
      </div>
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />
      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>
            {{ m.priceUsd | dollar }}
          </td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :is-loading="m.isLoading || false"
              v-if="!m.url"
              @custom-click="getWebSite(m)"
            >
              <slot> get Link </slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">{{
              m.url
            }}</a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import PxButton from "@/components/PxButton.vue";
export default {
  name: "CoinDetail",
  components: { PxButton },
  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd:true,
      converValue: null
    };
  },
  watch: {
    $route() {
      this.isLoading = true;
      const id = this.getCoin();
      Promise.all([this.getAsset(id), this.getHistory(id), this.getMarkets(id)])
        .then(([data, history, markets]) => {
          this.asset = data.data.data;
          this.history = history.data.data;
          this.markets = markets.data.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  computed: {
    converResult(){
      if(!this.converValue){
        return 0;
      }
      const result =  this.fromUsd ? this.converValue / this.asset.priceUsd: this.converValue * this.asset.priceUsd;
      return result.toFixed(2);
    },
    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    avg() {
      return Math.abs(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
  },
  created() {
    this.isLoading = true;
    const id = this.getCoin();
    Promise.all([this.getAsset(id), this.getHistory(id), this.getMarkets(id)])
      .then(([data, history, markets]) => {
        this.asset = data.data.data;
        this.history = history.data.data;
        this.markets = markets.data.data;
      })
      .finally(() => {
        this.isLoading = false;
      });
  },

  methods: {
    getCoin() {
      const id = this.$route.params.id;
      return id;
    },
    toggleConverter(){
      this.fromUsd = !this.fromUsd;
    },
    getAsset(id) {
      return this.axios.get(`${api.url}/assets/${id}`);
    },
    getHistory(id) {
      const now = new Date();
      const end = now.getTime();
      now.setDate(now.getDate() - 1);
      const start = now.getTime();
      return this.axios.get(
        `${api.url}/assets/${id}/history?interval=h1&start=${start}&end=${end}`
      );
    },
    getMarkets(id) {
      return this.axios.get(`${api.url}/assets/${id}/markets?limit=5`);
    },
    getExchange(idExchange) {
      return this.axios.get(`${api.url}/exchanges/${idExchange}`);
    },
    getWebSite(exchange) {
      this.$set(exchange, "isLoading", true);
      return this.getExchange(exchange.exchangeId)
        .then((res) => {
          this.$set(exchange, "url", res.data.data.exchangeUrl);
        })
        .finally(() => this.$set(exchange, "isLoading", false));
    },
  },
};
</script>
<style scoped>
  td {
    padding: 10px;
    text-align: center;
  }
</style>