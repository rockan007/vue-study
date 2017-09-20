<!--界面：消息发布-->
<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell weui-cell_select weui-cell_select-after ">
        <div class="weui-cell__hd">
          <label for class="weui-label">消息类型</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select" name="select" v-on:change="getMsgType($event)">
            <option v-for="(msgStyle,index) in msgStyles" v-bind:selected="msgStyle.typeNo===msgType"
                    v-bind:value="msgStyle.typeNo">{{msgStyle.typeName}}
            </option>
          </select>
        </div>
      </div>
      <div class="weui-cell weui-cell_access" v-on:click="routeToPersons">
        <div class="weui-cell__bd">
          通知人员选择
        </div>
        <div class="weui-cell__ft">
          {{chosePersons.length > 99 ? "99+" : chosePersons.length}}
        </div>
      </div>
      <div v-if="isShow.title" class="weui-cell">
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入通知标题"/>
        </div>
      </div>
      <div v-if="isShow.description||isShow.extra" class="weui-cell">
        <div class="weui-cell__bd">
          <textarea v-if="isShow.description" style="width: 100%" rows="8" v-model.trim="description"
                    class="weui-textarea"
                    placeholder="在此输入通知内容"></textarea>
          <extra-file v-if="isShow.extra" v-bind:msgType="msgType" v-on:showToast="showToast"
                      v-bind:uploadFiles="uploadFiles" v-on:uploadFile="getUploadFile"></extra-file>
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
  import $ from 'jquery'

  export default {
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type: Array,
        default: function () {
          return []
        }
      },
      content: '',
      uploadFiles: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
      extraFile, toast
    },
    data: function () {
      return this.getDefaultData()

    },
    created: function () {
      console.log('获取的类型数据：' + JSON.stringify(consts.MSGSTYLES))
    },
    watch: {
      msgType: function (newVal) {
        this.setElementShow(newVal)
      },
      uploadFiles: function (newVal) {
        console.log('dynamic-publish获取的文件列表：' + JSON.stringify(newVal))
      }
    },
    methods: {
      getDefaultData: function () {
        return {
          msgType: 0,
          msgStyles: consts.MSGSTYLES,
          title: '',
          description: '',
          uploadFile: {},
          isShowToast: false,
          toastContent: '',
          isShow: {
            title: false,
            description: true,
            extra: false
          },
          publishing: false
        }
      },
      showToast: function (content) {
        this.toastContent = content
        this.isShowToast = true

      },
      setElementShow: function (type) {
        switch (type) {
          case 0://文字
            this.isShow = {
              title: false,
              description: true,
              extra: false
            }
            break
          case 1://文字卡片
            this.isShow = {
              title: true,
              description: true,
              extra: false
            }
            break
          case 2://图文
            this.isShow = {
              title: true,
              description: true,
              extra: true
            }
            break
          case 3://图片
          case 4://语音
            this.isShow = {
              title: false,
              description: false,
              extra: true
            }
            break
          case 5://视频
            this.isShow = {
              title: true,
              description: true,
              extra: true
            }
            break
          case 6://文件
            this.isShow = {
              title: false,
              description: false,
              extra: true
            }
            break
          default:
            break
        }
      },
      getUploadFile: function (fileInfo) {
        console.log('dynamic-publish.vue获取的文件信息:' + JSON.stringify(fileInfo))
        this.uploadFile = fileInfo
        this.$emit('uploadFiles', [fileInfo])
      },
      publishMethod: function () {
        if (this.publishing) {
          return
        }
        this.publishing = true
        console.log('&&&&&com-publish&&&&&发布按钮的点击事件')
        if (this.chosePersons.length === 0) {
          this.toastContent = '请选择接收人'
          this.isShowToast = true
          this.publishing = false
          return
        }
        console.log('是否合法？？？？' + this.isLegal())
        if (!this.isLegal()) {
          this.isShowToast = true
          this.publishing = false
          return
        }
        this.getPublishContent()
      },
      isLegal: function () {
        console.log('当前消息类型：' + this.msgType)
        switch (this.msgType) {
          case 0:
            if (this.description.length === 0) {
              this.toastContent = '请输入文字'
              return false
            }
            if (this.description.length > 1000) {
              this.toastContent = '内容不得超过1000字'
              return false
            }
            return true
          case 1:
            if (this.title.length === 0) {
              this.toastContent = '请输入标题'
              return false
            }
            if (this.description.length === 0) {
              this.toastContent = '请输入文本内容'
              return false
            }
            if (this.title.length > 60) {
              this.toastContent = '标题不得大于60字'
              return false
            }
            if (this.description.length > 250) {
              this.toastContent = '文本内容不得超过250字'
              return false
            }
            return true
          case 2://图文
          case 5://视频
            if (this.title.length === 0) {
              this.toastContent = '请输入标题'
              return false
            }
            if (this.description.length === 0) {
              this.toastContent = '请输入内容'
              return false
            }
            if (this.title.length > 60) {
              this.toastContent = '标题不得大于60字'
              return false
            }
            if (this.description.length > 250) {
              this.toastContent = '内容不得超过250字'
              return false
            }
            if (typeof (this.uploadFile.fileurl) === 'undefined') {
              this.toastContent = '请选择附件'
              return false
            }
            return true
          case 3:
          case 4:
          case 6:
            if (typeof(this.uploadFile.fileurl) === 'undefined') {
              this.toastContent = '请选择附件'
              return false
            }
            return true
          default:
            return false
        }
      },

      getMsgType: function (event) {
        this.msgType = parseInt(event.target.value)
      },
      getPublishContent: function () {
        let publishContent
        switch (this.msgType) {
          case 0:
            publishContent = {
              content: this.description
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
            let extraData = $.extend({
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
          case 3://
            publishContent = this.uploadFile
            break
          case 4://语音
            publishContent = $.extend({
              voice: {
                media_id: ''
              }
            }, this.uploadFile)
            break

          case 5://视频
            publishContent = $.extend({
              video: {
                media_id: '',
                title: this.title,
                description: this.description
              }
            }, this.uploadFile)
            break
          case 6://文件
            publishContent = $.extend({
              file: {
                media_id: ''
              }
            }, this.uploadFile)
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
        let com = this
        request.postMessage(this.chosePersons, content, function (data) {
          console.log('发送消息，返回的值：' + JSON.stringify(data))
          console.log(data)
          com.publishing = false
          if (data.RspCode === '0000') {
            com.toastContent = '发布成功'
            com.isShowToast = true
            com.resetData()
            sessionStorage.clear()
            com.$emit('pubSuccess')
          } else {
            com.toastContent = '发布失败:' + data.RspTxt
            com.isShowToast = true
          }
        })

      },
      resetData: function () {

        this.title = ''
        this.description = ''
        this.uploadFile = {}
        this.isShowToast = false
        this.toastContent = ''
        this.$emit('uploadFiles', [])
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

