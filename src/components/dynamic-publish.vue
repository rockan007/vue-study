<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入通知标题"/>
        </div>
      </div>
      <div v class="weui-cell">
        <div class="weui-cell_bd">
          <textarea rows="10" v-model.trim="description" class="weui-textarea" placeholder="在此输入通知内容"></textarea>
          <extra-file v-bind:msgType="msgType"></extra-file>
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
  </div>
</template>
<script>
  import extraFile from './extraFile.vue'
  import consts from '../mock-data/consts'
  import router from '../router/index'

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
      extraFile
    },
    data: function () {
      return {
        msgType: 1,
        msgStyles: consts.MSGSTYLES,
        title: '',
        description: ''
      }
    },
    created: function () {
      console.log('获取的类型数据：' + JSON.stringify(consts.MSGSTYLES))
    },
    methods: {
      publishMethod: function () {
        console.log('&&&&&com-publish&&&&&发布按钮的点击事件')
        if (this.chosePersons.length === 0) {
          console.log('请选择人员！')
          return
        }
        this.judageIsLegal()
      },
      judageIsLegal: function () {
        switch (this.msgType) {
          case 0:
            if (this.content.length === 0) {
              console.log('请填写内容！')
              return
            }
            this.extraData = {
              content: this.content
            }
            break
          case 1:
            if (typeof(this.extraData.textcard) === 'undefined') {
              console.log('文字卡片未填写内容！！！')
              return
            }
            break
          case 2:
          case 5:
            if (typeof(this.extraData.news) === 'undefined') {
              console.log('请填写内容和选择文件！！！')
              return
            }
            break
          case 3:
          case 4:
          case 6:
            if (typeof(this.fileInfo.fileurl) === 'undefined') {
              console.log('请选择文件')
              return
            }
            this.extraData = this.fileInfo
            break
          default:
            break
        }
        this.publish()
      },
      publish: function () { //发布
        let tStyle = this.getPubStyle()
        this.extraData.msgtype = tStyle.msgtype
        this.extraData.type = tStyle.type
        console.log('&&&&&com-publish&&&&&发布事件！' + JSON.stringify(this.extraData))
        request.postMessage(this.chosePersons, this.extraData, function (data) {
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
      },
      getType: function (event) {
        console.log(event.target.value)
        this.msgType = parseInt(event.target.value)
      }

    }
  }
</script>
<style scoped>
  .weui-cells {
    margin-top: 0;
  }
</style>

