<!--文件选择组件-->
<template>
  <div class='weui-uploader'>
    <!--<div class='weui-uploader__hd'>-->
      <!--&lt;!&ndash;<p class='weui-uploader__title'>{{getHintInfo()}}</p>&ndash;&gt;-->
      <!--<div class='weui-uploader__info'>{{uploadFiles.length}}/1</div>-->
    <!--</div>-->
    <div class='weui-uploader__bd'>
      <ul class='weui-uploader__files' id="uploaderFiles">
        <li v-for="file in uploadFiles" class='weui-uploader__file'
            v-bind:style="{'background-image':'url('+file.fileurl+')'}"></li>
      </ul>
      <div class='weui-uploader__input-box'>
        <input  id="uploaderInput" class='weui-uploader__input' type="file" v-bind:accept="getAcceptType()"
               v-on:change="selectFile($event)">
      </div>
    </div>
  </div>
</template>
<script>
  import router from '../router/index'

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
      getAcceptType: function () {
        var acceptType
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
            acceptType = '*'
            break
          default:
            break
        }
        return acceptType
      },
      getHintInfo: function () {
        console.log('选择文件时的文件类型：' + this.msgType)
        var hintInfo
        switch (this.msgType) {
          case 0:
            hintInfo = '添加文字'
            break
          case 1:
            hintInfo = '添加文本'
            break
          case 2:
            hintInfo = '添加图文'
            break
          case 3:
            hintInfo = '添加图片'
            break
          case 4:
            hintInfo = '添加语音'
            break
          case 5:
            hintInfo = '添加视频'
            break
          case 6:
            hintInfo = '添加文件'
            break
          default:
            break
        }
        return hintInfo
      },
      selectFile: function (event) {

      }
    }
  }
</script>
