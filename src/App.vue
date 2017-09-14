<!--App首页-->
<template>
  <div id="app">
    <transition>
      <keep-alive>
        <router-view v-on:chosePersons="getChosePerson" v-bind:chosePersons="chosePersons"></router-view>

      </keep-alive>
    </transition>
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

