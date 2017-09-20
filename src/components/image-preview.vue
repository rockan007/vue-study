<!--组件：图片预览-->
<template>
  <div>
    <div class="weui-gallery display-block" id="gallery" v-on:click="showGallery=false">
      <div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div v-for="(image,index) in dealtImages" class="swiper-slide" v-bind:style="{backgroundImage:'url('+image.fileurl+')',
          backgroundSize:'cover'}">
          </div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <div class="weui-gallery__opr" v-on:click="showDialog=true">
        <a class="weui-gallery__del">
          <i class="weui-icon-delete weui-icon_gallery-delete">

          </i>
        </a>
      </div>
    </div>
    <div class="js_dialog" v-bind:class="[{displayNone:!showDialog},{displayBlock:showDialog}]">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
        <div class="weui-dialog__hd">
          <strong class="weui-dialog__title">删除图片</strong>
        </div>
        <div class="weui-dialog__bd">确定要删除此张图片？</div>
        <div class="weui-dialog__ft">
          <a class="weui-dialog__btn weui-dialog__btn-default" v-on:click="delImage()">确定</a>
          <a class="weui-dialog__btn weui-dialog__btn_primary" v-on:click="showDialog=false">取消</a>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import 'swiper/dist/css/swiper.min.css'
  import Swiper from 'swiper/dist/js/swiper.min'
  import router from '../router/index'

  export default {
    name: 'image-preview',
    props: {
      uploadFiles: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data: function () {
      return {
        showGallery: false,
        mSwiper: {},
        dealtImages: this.uploadFiles,
        showDialog: false
      }

    },
    watch: {
      uploadFiles: function (newVal) {
        console.log('preview界面获取的uploadFiles：' + JSON.stringify(newVal))
      }
    },
    mounted: function () {
      this.mSwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
      })
    },
    methods: {
      delImage: function () {
        console.log('删除文件')
        this.dealtImages.splice(this.mSwiper.activeIndex, 1)
        console.log('删除文件后的值：' + JSON.stringify(this.dealtImages))
        this.$emit('dealtImages', this.dealtImages)
        this.showDialog = false
        if (this.dealtImages.length === 0) {
          router.go(-1)
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
    margin-bottom: 60px;
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
