<!--界面：消息发布-->
<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea class="weui-textarea title" maxlength="60" v-model.trim="title" placeholder="在此输入通知标题,最多60字">
          </textarea>
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea v-model.trim="description" maxlength="250"
                    class="weui-textarea description"
                    placeholder="在此输入通知内容,最多250字"></textarea>

        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <extra-file v-bind:msgType="msgType" v-on:showToast="showToast"
                      v-bind:uploadFiles="uploadFiles" v-on:uploadFiles="getUploadFiles"
                      v-on:isUploading="isUploading"></extra-file>
        </div>
      </div>
      <div style="width: 100%;height: 10px;background-color: #f2f2f2"></div>
      <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">是否群发</div>
        <div class="weui-cell__ft">
          <label for="switch" class="weui-switch-cp">
            <input id="switch" class="weui-switch-cp__input" type="checkbox" checked
                   v-on:change="isDepartPublish($event)">
            <div class="weui-switch-cp__box"></div>
          </label>
        </div>
      </div>
      <div v-if="!isPubDepart" class="weui-cell weui-cell_access" v-on:click="routeToPersons(0)">
        <div class="weui-cell__bd">
          通知人员选择
        </div>
        <div class="weui-cell__ft">
          {{chosePersons.size > 99 ? "99+" : chosePersons.size}}
        </div>
      </div>
      <div v-if="isPubDepart" class="weui-cell weui-cell_access" v-on:click="routeToPersons(1)">
        <div class="weui-cell__bd">
          通知部门选择
        </div>
        <div class="weui-cell__ft">
          {{choseDeparts.size > 99 ? "99+" : choseDeparts.size}}
        </div>
      </div>
      <!--<div class="weui-cell weui-cell_switch">-->
      <!--<div class="weui-cell__bd">-->
      <!--是否短信同步-->
      <!--</div>-->
      <!--<div class="weui-cell__ft">-->
      <!--<input class="weui-switch" type="checkbox"/>-->
      <!--</div>-->
      <!--</div>-->
    </div>
    <a class="weui-btn weui-btn_primary" v-on:click="publishMethod">发布</a>
    <toast v-bind:isShow="isShowToast" v-bind:isLoading="isLoading" v-bind:toastContent="toastContent"
           v-on:toastClosed="isShowToast=false"></toast>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue'
  import { consts } from '../mock-data/consts'
  import router from '../router/index'
  import { request } from '../utils/request'
  import toast from './toast.vue'
  import { storage } from '../utils/storage'

  export default {
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type: Map,
        default: function () {
          return new Map()
        }
      },
      choseDeparts: {
        type: Map,
        default: function () {
          return new Map()
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
      },
      isPubDepart: function (newVal) {
        if (newVal) {

        } else {

        }
      }
    },
    methods: {
      isDepartPublish: function (e) {
        this.isPubDepart = e.target.checked
      },
      getDefaultData: function () {
        return {
          isPubDepart: true,//发送到部门，false发送到人员
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
          isLoading: false,
          chooseType: 1,//0：人员 1部门
          choseDepartsPersons: new Map()
        }
      },
      showToast: function (content) {
        this.toastContent = content
        this.isShowToast = true

      },
      isUploading: function (isUp) {
        this.isLoading = isUp
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
        console.log('&&&&&com-publish&&&&&发布按钮的点击事件')
        if (this.publishing) {
          return
        }
        this.publishing = true
        if (!this.isPubDepart && this.chosePersons.length > 1000) {
          this.toastContent = '选择部门人员数大于1000，无法发布'
          this.isShowToast = true
          this.publishing = false
          return
        }
        if (!this.isPubDepart && this.chosePersons.size === 0) {
          this.toastContent = '请选择接收人员'
          this.isShowToast = true
          this.publishing = false
          return
        }
        if (this.isPubDepart && this.choseDeparts.size === 0) {
          this.toastContent = '请选择接收部门'
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
            publishContent = {
              news: {
                articles: [
                  {
                    title: this.title,
                    description: this.description,
                    picurl: this.getPostFileInfo().fileurl
                  }
                ]
              }
            }
            break
          case 3://

            break
          case 4://语音
            publishContent = Object.assign({
              voice: {
                media_id: ''
              }
            }, this.uploadFile)
            break

          case 5://视频
            publishContent = Object.assign({
              video: {
                media_id: '',
                title: this.title,
                description: this.description
              }
            }, this.uploadFile)
            break
          case 6://文件
            publishContent = Object.assign({
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
        console.log('****publish****')
        let com = this

        console.log('当前发布信息内容：' + JSON.stringify(content))
        let pubMap
        if (com.isPubDepart) {
          pubMap = com.choseDeparts
        } else {
          pubMap = com.chosePersons
        }
        request.postMessage(com.isPubDepart, pubMap, content, function (data) {
          console.log('发送消息，返回的值：' + JSON.stringify(data))
          console.log(data)
          com.publishing = false
          if (data.RspCode === '0000') {
            com.toastContent = '发布成功'
            com.isShowToast = true
            com.resetData()
            com.$emit('pubSuccess')
          } else {
            com.toastContent = '发布失败:' + data.RspTxt
            com.isShowToast = true
          }
        })
      },
      getDepartsPersons: function (callback) {
        console.log('***getDepartsPersons***')
        let com = this
        let departsArr = Array.from(com.choseDeparts.keys())
        console.log('获取的部门数组：' + JSON.stringify(departsArr))
        if (departsArr.length > 0) {
          let count = 0
          for (let departId of departsArr) {
            this.getDepartPersons(departId, function () {
              count++
              console.log('此时的循环次数：' + count)
              if (count === departsArr.length) {
                console.log('获取的部门人员信息：' + JSON.stringify(com.chosePersons))
                callback()
              }
            })
          }
        } else {
          console.log('获取的部门人员信息：' + JSON.stringify(com.chosePersons))
          callback()
        }
      },
      getDepartPersons: function (departId, callback) {
        console.log('****getDepartPersons*****')
        let com = this
        request.getDepartPersons(departId, 1, 0, function (response) {
          console.log('获取的人员详情：' + JSON.stringify(response))
          for (let person of response) {
            com.chosePersons.set(person.userid, person.name)
          }
          callback()
        })
      },
      resetData: function () {
        this.title = ''
        this.description = ''
        this.$emit('clearData')
      },
      getPubStyle: function () { //發佈的類型
        for (let i in consts.MSGSTYLES) {
          let msgStyle = consts.MSGSTYLES[i]
          if (msgStyle.typeNo === this.msgType) {
            return msgStyle
          }
        }
      },
      routeToPersons: function (type) {
        let name = type === 0 ? 'depart-person' : 'choose-depart'
        if (type === 0) {
          storage.setSessionMap(consts.KEY_CHOOSE_PERSONS, this.chosePersons)
        } else {
          storage.setSessionMap(consts.KEY_CHOOSE_PERSONS, this.choseDeparts)
          storage.setSessionSet(consts.KEY_ALL_CHOOSE_DEPARTS, this.choseDeparts.keys())
        }
        router.push({
          name: name,
          params: {
            id: -1,
            path: '0'
          }
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

  .weui-switch:checked, .weui-switch-cp__input:checked ~ .weui-switch-cp__box {
    border-color: #46bdff;
    background-color: #46bdff;
  }

  .weui-btn_primary {
    background-color: #46bdff;
    margin: 0 2.5%;
  }

  .weui-btn_primary:not(.weui-btn_disabled):active {
    color: hsla(0, 0%, 100%, .6);
    background-color: #46bdff;

  }

  .weui-input, .weui-textarea {
    font-size: 15px;
  }

  .weui-textarea.description {
    height: 135px;
  }

  .weui-cells {
    font-size: 15px;
  }

  .weui-textarea.title {
    height: 44px;
  }

  .weui-cells:after {
    border-bottom: 0;
  }
</style>

