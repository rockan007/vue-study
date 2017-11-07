<template>
  <div class="js_dialog" v-bind:class="[{'display-none':!showDialog},{'display-block':showDialog}]">
    <div class="weui-mask"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd">
        <strong class="weui-dialog__title">{{dialogData.title}}</strong>
      </div>
      <div class="weui-dialog__bd">{{dialogData.content}}</div>
      <div class="weui-dialog__ft">
        <a class="weui-dialog__btn weui-dialog__btn-default" v-on:click="emitDiaCB(1)">确定</a>
        <a class="weui-dialog__btn weui-dialog__btn_primary" v-on:click="emitDiaCB(0)">取消</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'dialog-container',
    props: {
      showDialog: {
        type: Boolean,
        default: false
      },
      dialogData: {
        type: Object,
        default: function () {
          return {
            title: '刪除图片',
            content: '确定要删除这张图片？'
          }
        }
      }
    },
    created:function () {
      console.log("dialog+this.showDialog:"+this.showDialog)
    },
    data: function () {
      return {}
    },
    watch: {
      showDialog: function (newVal, oldVal) {
        console.log('***showDialog*****')
        console.log('newVal:' + newVal + ',oldVal:' + oldVal)
      },
      dialogData: function (newVal, oldVal) {
        console.log('****dialogData****')
        console.log('newVal:' + JSON.stringify(newVal) + ',oldVal:' + JSON.stringify(oldVal))

      }
    },
    methods: {
      emitDiaCB: function (type) {
        console.log("*****dialog*****type"+type)
        this.$emit('diaCallback', type)
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
</style>
