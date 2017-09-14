<!--界面：消息发布-->
<template>
  <div>
    <div class="weui-cells">
      <!--<div class="weui-cell weui-cell_select weui-cell_select-after ">-->
        <!--<div class="weui-cell__hd">-->
          <!--<label for class="weui-label">消息类型</label>-->
        <!--</div>-->
        <!--<div class="weui-cell__bd">-->
          <!--<select class="weui-select" name="select" v-on:change="getType($event)">-->
            <!--<option v-for="(msgStyle,index) in msgStyles" v-bind:selected="msgStyle.typeNo===msgType"-->
                    <!--v-bind:value="msgStyle.typeNo">{{msgStyle.typeName}}-->
            <!--</option>-->
          <!--</select>-->
        <!--</div>-->
      <!--</div>-->
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入通知标题"/>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell_bd">
          <textarea rows="10" v-model.trim="description" class="weui-textarea" placeholder="在此输入通知内容"></textarea>
          <extra-file v-on:uploadFile="getUploadFile"></extra-file>
        </div>
      </div>
      <div class="weui-cell weui-cell_access" v-on:click="routeToPersons">
        <div class="weui-cell__bd">
          通知人员选择
        </div>
        <div class="weui-cell__ft">
          {{chosePersons.length > 99 ? "99" : chosePersons.length}}
        </div>
      </div>
      <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">
          是否短信同步
        </div>
        <div class="weui-cell__ft">
          <input class="weui-switch" type="checkbox"/>
        </div>
      </div>
    </div>
    <a class="weui-btn weui-btn_primary" v-on:click="publishMethod">发布</a>
    <toast v-bind:isShow="isShowToast" v-bind:toastContent="toastContent" v-on:toastClosed="isShowToast=false"></toast>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue'
  import consts from '../mock-data/consts'
  import router from '../router/index'
  import request from '../utils/request'
  import toast from './toast.vue'
  import jQuery from 'jquery'

  export default {
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type: Array,
        default: function () {
          return []
        }
      },
      content: ''
    },
    components: {
      extraFile, toast
    },
    data: function () {
      return {
        msgType: 1,
        msgStyles: consts.MSGSTYLES,
        title: '',
        description: '',
        uploadFile: {},
        isShowToast: false,
        toastContent: ''
      }
    },
    created: function () {
      console.log('获取的类型数据：' + JSON.stringify(consts.MSGSTYLES))
    },
    methods: {
      getUploadFile: function (fileInfo) {
        this.uploadFile = fileInfo
      },
      publishMethod: function () {
        console.log('&&&&&com-publish&&&&&发布按钮的点击事件')
        if (this.chosePersons.length === 0) {
          this.toastContent = '请选择接收人'
          this.isShowToast = true
          return
        }
        if (this.title.length > 0 || typeof(this.uploadFile.fileurl) !== 'undefined') {
          this.getMsgType()
        } else {
          this.toastContent = '请填写标题或选择图片'
          this.isShowToast = true
        }

      },
      getMsgType: function () {
        if (this.title.length > 0 && typeof(this.uploadFile.fileurl) !== 'undefined') {//图文
          this.msgType = 2
        } else if (this.title.length > 0 && this.description.length > 0) {//文字卡片
          this.msgType = 1
        } else if (this.title.length > 0) {//文本消息
          this.msgType = 0
        } else if (typeof(this.uploadFile.fileurl) !== 'undefined') {//图片消息
          this.msgType = 3
        }
        this.getPublishContent()
      },
      getPublishContent: function () {

        let publishContent
        switch (this.msgType) {
          case 0:
            publishContent = {
              content: this.title
            }
            break
          case 1:
            publishContent = {
              textcard: {
                title: this.title,
                description: this.description
              }
            }
            break
          case 2://圖文
            let extraData = jQuery.extend({
              title: this.title,
              description: this.description,
              picurl: this.uploadFile.fileurl
            }, this.uploadFile)
            publishContent = {
              news: {
                articles: [extraData]
              }
            }
            break
          case 3:
            publishContent = this.uploadFile
            break
          default:
            break
        }
        let tStyle = this.getPubStyle()
        publishContent.type = tStyle.type
        publishContent.msgtype = tStyle.msgtype
        this.publish(publishContent)
      },
      publish: function (content) { //发布
        request.postMessage(this.chosePersons, content, function (data) {
          console.log('发送消息，返回的值：' + JSON.stringify(data))
          console.log(data)
          if (data.RspCode === '0000') {
            sessionStorage.clear()
            window.close() //关闭当前页面
          } else {
            console.log('发布通知失败：' + data.RspTxt)
          }
        })

      },
      getPubStyle: function () { //發佈的類型
        for (let i in consts.MSGSTYLES) {
          let msgStyle = consts.MSGSTYLES[i]
          if (msgStyle.typeNo === this.msgType) {
            return msgStyle
          }
        }
      },
      routeToPersons: function () {
        router.push({
          name: 'choose-container',
        })
      }
    }
  }
</script>
<style scoped>
  .weui-cells {
    margin-top: 0;
  }
</style>

