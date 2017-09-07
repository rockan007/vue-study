import Vue from 'vue'
import Router from 'vue-router'
import dynamicPublish from '../components/dynamic-publish.vue'
import extraPublish from '../components/extra-publish.vue'
import msgHome from '../components/message-home.vue'
import msgContainer from '../components/message-container.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/msg-home'
    },
    {
      path: '/msg-home',
      name: 'msg-home',
      component: msgHome,
      children: [
        {
          path: 'dynamic-publish',
          name: 'dynamic-publish',
          component: dynamicPublish
        }, {
          path: 'message-container',
          name: 'message-container',
          component: msgContainer
        },
        {
          path: '',
          redirect: {
            name: 'dynamic-publish'
          }
        }
      ]
    },
    {
      path: '/extra-publish',
      name: 'extra-publish',
      component: extraPublish
    }
  ]
})
