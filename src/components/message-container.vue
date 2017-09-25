<!--消息通知界面-->
<template>
  <div>
    <search></search>
    <msg-banner></msg-banner>
    <msg-list></msg-list>
  </div>
</template>
<script>
  import msgSearch from './search.vue';
  import msgBanner from './message-banner.vue';
  import msgList from './message-list.vue';

  export default {

    name: 'message-container',
    data: function () {
      return {}
    },
    components: {
      msgSearch,
      msgBanner, msgList},
    methods: {}
  }
</script>
<style>

</style>
