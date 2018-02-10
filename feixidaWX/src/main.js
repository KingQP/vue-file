// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
window.$ = $;
import axios from "axios";
import echarts from "echarts";
//import Bootstrap from "bootstrap";
//import BootstrapTable from "bootstrap-table";
//import bootstrapTablezhCN from "bootstrap-table-zh-CN";

let storeUrl = {
	ipconfig: "http://192.168.31.45:9000",
	ipconfigWX: "http://wx.freshstartet.com/jssdk.php",
	login: "/api/api-token-auth/",
	device: "/api/device/scan/"
}

Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.prototype.$storeUrl = storeUrl


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
