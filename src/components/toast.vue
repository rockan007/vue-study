<template>
  <div v-bind:class="[{'display-none':!isToastShow&&!isLoading},{'display-show':isToastShow||isLoading}]">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-icon-warn weui-icon_toast"
         v-bind:class="[{'weui-icon-warn':!isLoading},{'weui-loading':isLoading}]"></i>
      <p class="weui-toast__content">{{isLoading ? "数据加载中" : toastContent}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'toast',
    props: {
      toastContent: {
        type: String,
        default: '请输入内容或选择图片'
      },
      toastDuration: {
        type: Number,
        default: 2
      },
      isShow: false,
      isLoading: false
    },
    data: function () {
      return {
        isToastShow: false
      }
    },
    watch: {
      isShow: function (newVal, oldVal) {
        let com = this
        if (newVal) {
          com.isToastShow = true
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
