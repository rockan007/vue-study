<!--组件：图片预览-->
<template>
  <div class="weui-gallery display-block" id="gallery" v-on:click="showGallery=false">
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div v-for="(image,index) in dealtImages" class="swiper-slide" v-bind:style="{backgroundImage:'url('+image.fileurl+')',
          backgroundSize:'cover'}">
          图片
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
    </div>
    <div class="weui-gallery__opr" v-on:click="delImage()">
      <a class="weui-gallery__del">
        <i class="weui-icon-delete weui-icon_gallery-delete">

        </i>
      </a>
    </div>
  </div>

</template>
<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
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
        dealtImages: this.images
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
        this.dealtImages.splice(this.mSwiper.activeIndex, 1)
        this.$emit('dealtImages', this.dealtImages)
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
