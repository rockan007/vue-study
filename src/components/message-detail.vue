<!--通知詳情界面-->
<template>
  <div>
    <!--通知内容-->
    <div>
      <h2></h2>
      <p></p>
      <div>
        <p>
          发布人
        </p>
        <p>发布时间</p>
      </div>
    </div>
    <!--通知人數或已阅读-->
    <div class="weui-flex">
      <div class="weui-flex__item">
        <p>通知人数</p>
      </div>
      <div class="weui-flex__item">
        <p>已阅读</p>
      </div>
      <div class="weui-flex__item">
        <p>未阅读</p>
      </div>

    </div>
    <!--回复列表-->
    <reply-list v-bind:msgId="msgId"></reply-list>
    <div class="weui-cell">
      <input class="weui-input"/>
    </div>
  </div>
</template>
<script>
  import replyList from './msg-reply-list.vue'

  export default {
    name: 'msg-detail',
    props: ['msgId'],
    components: {
      replyList
    },
    data: function () {
      return {}
    },
    methods: {}
  }
</script>
