<template>
  <div v-bind:class="[{'display-none':!isToastShow},{'display-show':isToastShow}]">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-icon-warn weui-icon_toast"></i>
      <p class="weui-toast__content">{{toastContent}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'toast',
    props: {
      toastContent: {
        type:String,
        default:"请输入内容或选择图片"
      },
      toastDuration: {
        type: Number,
        default:5
      },
      isShow: false
    },
    data:function () {
      return {
        isToastShow:false
      }
    },
    watch: {
      isShow: function (newVal, oldVal) {
        let com=this;
        if (newVal) {
          com.isToastShow=true;
          setTimeout(function () {
            com.isToastShow = false
            com.$emit('toastClosed')
          }, com.toastDuration * 1000)
        }
      }
    }
  }
</script>
<style>
  .display-none {
    opacity: 0;
    display: none;
  }

  .display-show {
    opacity: 1;
  }
</style>
