import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/tailwind.css'
import router from '@/router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { dollarFilter, percentFilter } from './filter';
import Chartick from 'vue-chartkick';
import {VueSpinners} from '@saeris/vue-spinners';
import Chart from 'chart.js';

Vue.config.productionTip = false;

Vue.use(VueSpinners);
Vue.use(Chartick.use(Chart));
Vue.use(VueAxios, axios);
Vue.filter("dollar", dollarFilter);
Vue.filter("percent", percentFilter);
new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
