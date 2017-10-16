<!--查看通知導航-->
<template>
  <div class="weui-flex">
    <div v-for="(msgBanner,index) in msgBanners" class="weui-flex__item"
         v-bind:class="[{'active':index===activeIndex}]" v-on:click="bannerClick(index,msgBanner)">
      <div class="placeholder">{{msgBanner.content}}</div>
    </div>
  </div>
</template>
<script>
  import { consts } from '../mock-data/consts'

  export default {
    name: 'msg-banner',
    data: function () {
      return {
        msgBanners: consts.MSGBANNERS,
        activeIndex: 0,
      }
    },
    methods: {
      bannerClick: function (index, banner) {
        this.activeIndex = index
        this.$emit('choseBanner', banner)
      }
    }
  }
</script>
<style scoped>
  .placeholder {
    margin: 5px;
    padding: 0 10px;
    height: 2.3em;
    line-height: 2.3em;
    text-align: center;

  }

  .active {
    border-bottom: 2px blue solid;
    color: blue;
  }
</style>
