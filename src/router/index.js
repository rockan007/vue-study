import Vue from 'vue';
import Router from 'vue-router';
import dynamicPublish from '../components/dynamic-publish.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dynamic-publish',
      component:dynamicPublish
    }
  ]
});
