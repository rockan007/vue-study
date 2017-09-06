import Vue from 'vue';
import Router from 'vue-router';
import dynamicPublish from '../components/dynamic-publish.vue';
import extraPublish from '../components/extra-publish.vue';
import msgHome from '../components/message-home.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'msg-home',
      component: msgHome
    },
    {
      path: '/dynamic-publish',
      name: 'dynamic-publish',
      component: dynamicPublish
    },
    {
      path: '/extra-publish',
      name: 'extra-publish',
      component: extraPublish
    }
  ]
})
