<!--文件选择组件-->
<template>
  <div class='weui-uploader'>
    <div class='weui-uploader__bd'>
      <ul class='weui-uploader__files' id="uploaderFiles">
        <li v-for="file in uploadFiles" class='weui-uploader__file'
            v-bind:style="{'background-image':'url('+file.fileurl+')'}"></li>
      </ul>
      <div class='weui-uploader__input-box'>
        <input id="uploaderInput" class='weui-uploader__input' type="file" accept="image/jpeg,image/png"
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
        uploadReal: false
      }
    },
    created: function () {

    },
    methods: {
//      getAcceptType: function () {
//        let acceptType
//        switch (this.msgType) {
//          case 0:
//            acceptType = '添加文字'
//            break
//          case 1:
//            acceptType = '添加文本'
//            break
//          case 2:
//            acceptType = 'image/jpeg,image/png'
//            break
//          case 3:
//            acceptType = ''
//            break
//          case 4:
//            acceptType = 'audio/AMR'
//            break
//          case 5:
//            acceptType = 'video/mp4'
//            break
//          case 6:
//            acceptType = '*'
//            break
//          default:
//            break
//        }
//        return acceptType
//      },
      selectFile: function (event) {
        let com = this
        if (event.target.value) {
          console.log('选中的文件路径：' + event.target.value)
          console.log(event.target.files)
          let file = event.target.files[0]
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
        }
      }
    }
  }
</script>
