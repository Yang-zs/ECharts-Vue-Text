import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import './assets/chalk'
import axios from 'axios'
import './assets/font/iconfont.css'
import '@/styles/reset.css'
import SocketService from "@/utils/sockte_service";
SocketService.Instance.connect();
Vue.prototype.$socket = SocketService.Instance;
// 将全局的echarts对象挂载到Vue的原型对象上
Vue.prototype.$echarts = echarts

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
