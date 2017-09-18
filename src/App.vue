<!--App首页-->
<template>
  <div id="app">
      <keep-alive include="dynamic-publish">
        <router-view v-on:chosePersons="getChosePerson" v-bind:chosePersons="chosePersons"></router-view>
      </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function () {
      return {
        chosePersons: []
      }
    },
    methods: {
      getChosePerson: function (persons) {
        this.chosePersons = persons
      }
    }

  }
</script>

