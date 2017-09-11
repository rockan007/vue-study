import Vue from 'vue'
import Router from 'vue-router'
import dynamicPublish from '../components/dynamic-publish.vue'
import extraPublish from '../components/extra-publish.vue'
import msgHome from '../components/message-home.vue'
import msgContainer from '../components/message-container.vue'
import msgDetail from '../components/message-detail.vue'
import choosePerson from '../components/choose-person.vue'
import chooseContainer from '../components/choose-container.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {//默认导向首页
      path: '/',
      redirect: '/msg-home'
    },
    {//首页
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
    {//附加发布
      path: '/extra-publish',
      name: 'extra-publish',
      component: extraPublish
    },
    {//消息详情
      path: '/message-detail/:id',
      name: 'message-detail',
      component: msgDetail
    },
    {
      path: '/choose-container',
      name: 'choose-container',
      component: chooseContainer,
      children: [
        {
          path: 'choose-person/:id/:path',
          name: 'choose-person',
          component: choosePerson
        },
        {
          path: '',
          redirect: {
            name: 'choose-person',
            params: {
              id: -1,
              path:'0'
            }
          }
        }
      ]
    }
  ]
})
