// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'ant-design-vue/dist/antd.css'

import { Button } from 'ant-design-vue';
import { VueAxios } from './utils/request'

Vue.config.productionTip = false
Vue.prototype.$axios = axios //将axios挂载在Vue实例原型上
Vue.use(Antd)
Vue.use(Button);
Vue.use(VueAxios)

// 设置axios请求的token
axios.defaults.headers.common['token'] = 'f4c902c9ae5a2a9d8f84868ad064e706'
//设置请求头
axios.defaults.headers.post["Content-type"] = "application/json"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
