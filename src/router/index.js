import Vue from 'vue'
import Router from 'vue-router'
import dynamicPublish from '../components/dynamic-publish.vue'
import msgHome from '../components/message-home.vue'
import msgContainer from '../components/message-container.vue'
import msgDetail from '../components/message-detail.vue'
import chooseContainer from '../components/choose-container.vue'
import readContainer from '../components/read-container.vue'
import imagePreview from '../components/image-preview.vue'
import chooseDepart from '../components/choose-depart.vue'
import departPerson from '../components/choose-depart-person.vue'

Vue.use(Router)
/**
 * router 配置页
 */
export default new Router({
  routes: [
    {//默认导向首页
      path: '/',
      redirect: '/dynamic-publish'
    },
    {//界面：新建通知
      path: '/dynamic-publish',
      name: 'dynamic-publish',
      component: dynamicPublish
    },
    {//界面：首页
      path: '/msg-home',
      name: 'msg-home',
      component: msgHome,
      children: [
        {//界面：新建通知
          path: '/dynamic-publish',
          name: 'dynamic-publish',
          component: dynamicPublish
        }, {//界面：查看通知
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
    {//界面：消息详情
      path: '/message-detail/:id',
      name: 'message-detail',
      component: msgDetail
    },
    {//界面：人员选择
      path: '/choose-container',
      name: 'choose-container',
      component: chooseContainer,
      children: [
        {
          path: 'depart-person/:id/:path',
          name: 'depart-person',
          component: departPerson
        },
        {
          path: 'choose-depart/:id/:path',
          name: 'choose-depart',
          component: chooseDepart
        },
        {
          path: '',
          redirect: {
            name: 'depart-person',
            params: {
              id: -1,
              path: '0'
            }
          }
        }
      ]
    },
    {//界面：已读
      path: 'read-container',
      name: 'read-container',
      component: readContainer
    },
    {//界面：图片预览
      path: '/image-preview/:index',
      name: 'image-preview',
      component: imagePreview
    }
  ]
})
