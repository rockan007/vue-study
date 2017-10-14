<!--App首页-->
<template>
  <div id="app" style="background-color: white">
    <keep-alive include="dynamic-publish">
      <router-view v-bind:uploadFiles="uploadFiles"
                   v-on:uploadFiles="getUploadFiles"
                   v-on:chosePersons="getChosePerson"
                   v-on:choseDeparts="getChoseDeparts"
                   v-bind:chosePersons="chosePersons"
                   v-bind:choseDeparts="choseDeparts"
                   v-on:clearData="clearData"
                   v-on:dealtImages="getDealtImages"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data: function () {
      return {
        chosePersons: new Map(),
        choseDeparts: new Map(),
        uploadFiles: []
      }
    },
    watch: {
      uploadFiles: function (newVal) {
        console.log('app.vue获取的选择的文件列表的当前值：' + JSON.stringify(newVal))
      }
    },
    methods: {
      clearData: function () {
        this.chosePersons = new Map()
        this.choseDeparts = new Map()
        this.uploadFiles = []
        sessionStorage.clear()
      },
      //获取选择的人
      getChosePerson: function (persons) {
        this.chosePersons = persons
      },
      getChoseDeparts: function (departs) {
        this.choseDeparts = departs
      },
      //获取伤处文件列表
      getUploadFiles: function (files) {
        console.log('app.vue获取的上传后的文件列表的当前值：' + JSON.stringify(files))
        this.uploadFiles = files
      },
      //获取删除的文件列表
      getDealtImages: function (files) {
        console.log('app.vue获取的删除后的文件列表的当前值：' + JSON.stringify(files))
        this.uploadFiles = files
      }
    }

  }
</script>

