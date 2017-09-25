<!--已读或未读列表-->
<template>
  <div>
    <search></search>
    <read-list></read-list>
  </div>
</template>
<script>
  import readList from './read-list.vue'
  import search from './search.vue'

  export default {
    name: 'read-container',
    components: {readList, search},
    data: function () {
      return {}
    },
    watch: {},
    created: function () {

    },
    methods: {}
  }
</script>
