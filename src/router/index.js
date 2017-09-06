import Vue from 'vue';
import Router from 'vue-router';
import dynamicPublish from '../components/dynamic-publish.vue';
import extraPublish from '../components/extra-publish.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
