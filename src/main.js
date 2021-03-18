import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios';
import vueXlsxTable from 'vue-xlsx-table'
import { VueMaskDirective } from 'v-mask'

Vue.directive('mask', VueMaskDirective);

Vue.use(vueXlsxTable, {rABS: false}) //Browser FileReader API have two methods to read local file readAsBinaryString and readAsArrayBuffer, default rABS false

axios.defaults.baseURL = 'http://localhost:19965';

Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
