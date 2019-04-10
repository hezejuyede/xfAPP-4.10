// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/less/base.less'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import echarts from 'echarts';
import promise from 'es6-promise';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;
promise.polyfill();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
