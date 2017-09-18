<!--文件选择组件-->
<template>
  <div class='weui-uploader'>
    <div class='weui-uploader__bd'>
      <ul class='weui-uploader__files' id="uploaderFiles">
        <li v-for="file in uploadFiles" class='weui-uploader__file'
            v-bind:style="{'background-image':'url('+file.fileurl+')'}"></li>
      </ul>
      <div class='weui-uploader__input-box'>
        <input id="uploaderInput" class='weui-uploader__input' type="file" v-bind:accept="getAcceptType()"
               v-on:change="selectFile($event)">
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../router/index'
  import compress from '../utils/compress'
  import jQuery from 'jquery'

  export default {
    name: 'extra-file',
    props: {
      msgType: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        uploadFiles: [],
        uploadReal: false,
        toastContent: ''
      }
    },
    created: function () {

    },
    watch: {
      msgType: function () {
        this.uploadFiles = []
      }
    },
    methods: {
      getAcceptType: function () {
        let acceptType
        switch (this.msgType) {
          case 0:
            acceptType = '添加文字'
            break
          case 1:
            acceptType = '添加文本'
            break
          case 2:
            acceptType = 'image/jpeg,image/png'
            break
          case 3:
            acceptType = 'image/jpeg,image/png'
            break
          case 4:
            acceptType = 'audio/AMR'
            break
          case 5:
            acceptType = 'video/mp4'
            break
          case 6:
            acceptType = ''
            break
          default:
            break
        }
        return acceptType
      },
      selectFile: function (event) {
        if (event.target.value) {
          console.log('选中的文件路径：' + event.target.value)
          console.log(event.target.files)
          let file = event.target.files[0]
          if (!this.isCurType(file)) {
            this.$emit('showToast', '所选文件类型错误')
            return
          }
          if (!this.isInSize(file)) {
            this.$emit('showToast', this.toastContent)
            return
          }
          this.uploadFile(file)
//          compress.uploadImg(file, 2, function (response) {
//            console.log('已上傳的文件！' + JSON.stringify(response))
//            if (response.RspCode === '0000') {
//              console.log()
//              com.uploadFiles = [response.RspData]
//              com.$emit('uploadFile', response.RspData)
//            } else {
//              console.log('发生错误！' + JSON.stringify(response))
//            }
//          })
        }
      },
      uploadFile: function (file) {
        let com = this
        switch (this.msgType) {
          case 2:
          case 3:
            compress.uploadImg(file, 2, function (response) {
              console.log('已上傳的文件！' + JSON.stringify(response))
              if (response.RspCode === '0000') {
                console.log()
                com.uploadFiles = [response.RspData]
                com.$emit('uploadFile', response.RspData)
              } else {
                console.log('发生错误！' + JSON.stringify(response))
              }
            })
            break
          case 4:
          case 5:
          case 6:
            let formData = new FormData()
            formData.append('file', file)
            compress.postFile(formData, function (response) {
              console.log('已上傳的文件！' + JSON.stringify(response))
              if (response.RspCode === '0000') {
                com.uploadFiles = [response.RspData]
                com.$emit('uploadFile', response.RspData)
              } else {
                console.log('发生错误！' + JSON.stringify(response))
              }
            })
            break
          default:
            break
        }
      },

      isCurType: function (file) {
        console.log('****extraFile****选中文件的类型:' + file.type)
        switch (this.msgType) {
          case 2://图文
          case 3:
            return file.type === 'image/jpeg' || file.type === 'image/png'
          case 4://语音
            return file.type === 'audio/AMR'

          case 5://视频
            return file.type === 'video/mp4'
          case 6:
            return true
          default:
            return false
        }
      },
      isInSize: function (file) {
        let multi = 1024 * 1024
        if (file.size <= 5) {
          this.toastContent = '请确保文件大于5字节'
          return false
        }
        switch (this.msgType) {
          case 4:
            this.toastContent = '请确保文件小于2M'
            return file.size < 2 * multi
          case 5:
            this.toastContent = '请确保文件小于4M'
            return file.size < 4 * multi
          case 6:
            this.toastContent = '请确保文件小于4M'
            return file.size < 4 * multi
          default:
            return true
        }
      }
    }
  }
</script>
