<!--文件选择组件-->
<template>
    <div class='weui-uploader'>
      <div class='weui-uploader__bd'>
        <ul class='weui-uploader__files' id="uploaderFiles">
          <li v-for="(image,index) in showImages" class='weui-uploader__file'
              v-bind:style="{backgroundImage:'url('+image+')'}" v-on:click="previewImage()">
            <div class="weui-uploader__file-content"
                 v-bind:class="[{displayNone:msgType!==5},{displayBlock:msgType===5}]">
              video
            </div>
          </li>
        </ul>
        <div class='weui-uploader__input-box'>
          <input id="uploaderInput" class='weui-uploader__input' type="file" v-bind:accept="getAcceptType()"
                 v-on:change="selectFile($event)" v-bind:disabled="uploadFiles.length>=9" multiple>
        </div>
      </div>
    </div>
</template>
<script>
  import router from '../router/index'
  import compress from '../utils/compress'

  export default {
    name: 'extra-file',
    props: {
      msgType: {
        type: Number,
        default: 2
      },
      uploadFiles: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      //在路由离开前，清空value值
      $('#uploaderInput').value = 'undefined'
    },
    data () {
      return {
        toastContent: '',
        showGallery: false,
        showImages: [],
        isUploading: false
      }
    },
    mounted: function () {
    },
    created: function () {
    },
    watch: {
      msgType: function (newVal) {
        console.log('extraFile.vue获取的nmsgType newVal:' + newVal)
      },
      uploadFiles: function (newVal, oldVal) {
        console.log('文件数组已改变：' + JSON.stringify(newVal))
        this.showImages = []
        for (let i in newVal) {
          this.getBackImg(newVal[i])
        }
      }
    },
    methods: {
      getBackImg: function (fileInfo) {
        let com = this
        switch (this.msgType) {
          case 1:
          case 2:
          case 3:
            this.showImages.push(fileInfo.fileurl)
            break
          case 5:
            console.log('extraFile为视频')
            compress.getVideoCover(fileInfo.fileurl, function (base64url) {
              com.showImages.push(base64url)
            })
            break
          default:
            break
        }
      },
      previewImage: function () {
        console.log('选择后的文件点击事件')
        if (this.msgType !== 1 && this.msgType !== 2 && this.msgType !== 3) {
          return
        }
        router.push({
          name: 'image-preview'
        })
      },
      getAcceptType: function () {
        let acceptType
        switch (this.msgType) {
          case 0:
            acceptType = '添加文字'
            break
          case 1:
            acceptType = 'image/jpeg,image/png'
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
          let files = event.target.files
          if (files.length > 9 - this.uploadFiles.length) {
            this.$emit('showToast', '请确保附件总数不多于9张')
            return
          }
          let file = event.target.files[0]
          if (!this.isCurType(file)) {
            this.$emit('showToast', '所选文件类型错误')
            return
          }
          if (!this.isInSize(file)) {
            this.$emit('showToast', this.toastContent)
            return
          }
          this.uploadFile(files)
        }
      },
      uploadFile: function (files) {
        let com = this
        com.isUploading = true
        this.$emit('isUploading',isUploading)
        switch (this.msgType) {
          case 1:
          case 2:
          case 3:
            let count = 0
            let upLoaded = []
            files.forEach(function (file, index) {
              com.uploadImage(file, index, function (i, data) {
                count++
                upLoaded[i] = data
                if (count === files.length) {
                  com.isUploading = false
                  com.$emit('uploadFiles', upLoaded)
                }
              })
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
      uploadImage: function (img, index, callback) {
        let com=this;
        compress.uploadImg(img, 2, function (response) {
          console.log('已上傳的文件！' + JSON.stringify(response))
          if (response.RspCode === '0000') {
            callback(index, response.RspData)
//            com.$emit('uploadFile', response.RspData)
          } else {
            com.isUploading = false
            com.$emit('isUploading',isUploading)
            com.$emit('showToast', '上传失败，请重新上传')
            console.log('发生错误！' + JSON.stringify(response))
          }
        })
      },
      isCurType: function (file) {
        console.log('****extraFile****选中文件的类型:' + file.type)
        switch (this.msgType) {
          case 1:
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
<style scoped>
  .display-none {
    display: none;
    opacity: 0;
  }

  .display-block {
    display: block;
    opacity: 1;
  }

  .swiper-container {
    width: 100%;
    height: 90%;
    margin-bottom: 50px;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
</style>
