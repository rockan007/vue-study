<!--App首页-->
<template>
  <div id="app">
    <keep-alive include="dynamic-publish">
      <router-view v-bind:uploadFiles="uploadFiles"
                   v-on:uploadFiles="getUploadFiles"
                   v-on:chosePersons="getChosePerson"
                   v-bind:chosePersons="chosePersons"
                   v-on:dealtImages="getDealtImages"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function () {
      return {
        chosePersons: [],
        uploadFiles: []
      }
    },
    methods: {
      getChosePerson: function (persons) {
        this.chosePersons = persons
      },
      getUploadFiles: function (files) {
        this.uploadFiles = files
      },
      getDealtImages: function (files) {
        this.uploadFiles = files
      }
    }

  }
</script>

