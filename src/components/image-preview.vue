<!--组件：图片预览-->
<template>
  <div class="page gallery js_show">
    <div class="page__hd">

    </div>
    <div class="weui-gallery" style="display: block">
      <span v-for="img in images" class="weui-gallery__img" v-bind:style="{'background-image':'url('+img+')'}">
      </span>
    </div>
    <div class="weui-gallery__opr">
      <a class="weui-gallery__del">
        <i class="weui-icon-delete weui-icon_gallery-delete"></i>
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    name:'image-preview',
    props:{
      images:{
        type:Array,
        default:function () {
          return []
        }
      }
    }
  }
</script>
