<!--組件：已讀或未讀人員列表-->
<template>
  <div>
    <div v-for="(classInfo,index) in classes">
      <p><span></span>{{classInfo.className}}</p>
      <div>
        <div v-for="(person,index) in classInfo.readPersons">
          <img v-bind:src="person.url">
          <p>{{person.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'read-list',
    props: {
      msgInfo: {
        type: Object
      }
    },
    data: function () {
      return {
        classes: []
      }
    },
    created: function () {
      this.requestList();
    },
    watch: {},
    methods: {
      //获取已读或未读列表
      requestList:function () {

      }
    }
  }
</script>
