<!--已读或未读列表-->
<template>
  <div>
    <msg-search></msg-search>
    <read-list></read-list>
  </div>
</template>
<script>
  import readList from './read-list.vue'
  import msgSearch from './message-search.vue'

  export default {
    name: 'read-container',
    components: {readList, msgSearch},
    data: function () {
      return {}
    },
    watch: {},
    created: function () {

    },
    methods: {}
  }
</script>
