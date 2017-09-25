<!--界面：消息发布-->
<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入通知标题"/>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea style="width: 100%" rows="8" v-model.trim="description"
                    class="weui-textarea"
                    placeholder="在此输入通知内容"></textarea>
          <extra-file v-bind:msgType="msgType" v-on:showToast="showToast"
                      v-bind:uploadFiles="uploadFiles" v-on:uploadFiles="getUploadFiles"
                      v-on:isUploading="isUploading"></extra-file>
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
    <toast v-bind:isShow="isShowToast" v-bind:isLoading="isLoading" v-bind:toastContent="toastContent"
           v-on:toastClosed="isShowToast=false"></toast>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue'
  import consts from '../mock-data/consts'
  import router from '../router/index'
  import request from '../utils/request'
  import toast from './toast.vue'

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
//        this.setElementShow(newVal)
      },
      uploadFiles: function (newVal) {
        console.log('dynamic-publish获取的文件列表：' + JSON.stringify(newVal))
      }
    },
    methods: {
      getDefaultData: function () {
        return {
          msgType: 2,
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
          publishing: false,
          isLoading: false
        }
      },
      showToast: function (content) {
        this.toastContent = content
        this.isShowToast = true

      },
      isUploading: function (isUp) {
        this.isLoading = isUp
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
              extra: true
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
      getUploadFiles: function (files) {
        console.log('dynamic-publish.vue获取的文件信息:' + JSON.stringify(files))
        switch (this.msgType) {
          case 2:
          case 3:
            this.$emit('uploadFiles', this.uploadFiles.concat(files))
            break
          default:
            this.$emit('uploadFiles', files)
            break
        }

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
        if (this.uploadFiles.length === 0) {
          this.msgType = 1
        } else {
          this.msgType = 2
        }
        return true
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
            publishContent = $.extend({
              news: {
                articles: [
                  {
                    title: this.title,
                    description: this.description,
                    picurl: this.uploadFiles[0].fileurl
                  }
                ]
              }
            }, this.getPostFileInfo())
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
      },
      //获取文档信息
      getPostFileInfo: function () {
        let filephypaths = []
        let fileurls = []
        for (let fileInfo of this.uploadFiles) {
          filephypaths.push(fileInfo.filephypath)
          fileurls.push(fileInfo.fileurl)
        }
        return {
          filephypath: filephypaths.join('|='),
          fileurl: fileurls.join('|=')
        }
      }
    }
  }
</script>
<style scoped>
  .weui-cells {
    margin-top: 0;
  }
</style>

