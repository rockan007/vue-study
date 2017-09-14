// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/weui.min.css'
import './assets/css/weui-extra.min.css'
import './assets/js/vconsole.min'

/* eslint-disable no-new */
/**
 * 首页
 */
new Vue({
  el: '#app',
  router,
  template: '<App></App>',
  components: {App}
})
