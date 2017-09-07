<template>
  <div>
    <!--通知内容-->
    <div>

    </div>
    <!--通知人數或已阅读-->
    <div>

    </div>
    <!--回复列表-->
    <reply-list v-bind:msgId="msgId"></reply-list>
  </div>
</template>
<script>
  import replyList from './msg-reply-list.vue'

  export default {
    name: 'msg-detail',
    props:['msgId'],
    components: {
      replyList
    },
    data: function () {
      return {}
    },
    methods: {}
  }
</script>
