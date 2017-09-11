<template>
  <div>
    <router-view v-on:choosePersons="getChoosePersons" v-on:chooseDeparts="getChooseDeparts"
                 v-bind:class="[{'margin-bottom50':choseAllPersons.size>0}]"></router-view>
    <div v-if="choseAllPersons.size>0" class="weui-flex fixed_bottom">
      <div class="weui-flex__item">
        <a class="weui-btn weui-btn_default">
          取消
        </a>
      </div>
      <div class="weui-flex__item" v-on:click="chooseDepartsPersons">
        <a class="weui-btn weui-btn_primary">
          确定({{choseAllPersons.size > 99 ? "99+" : choseAllPersons.size}})
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'choose-container',
    props: {},
    data: function () {
      return {
        choseAllPersons: new Set(),
        choosePersons: new Map(),
        chooseDeparts: new Map()
      }
    },
    methods: {
      chooseDepartsPersons: function () {
        this.$emit('choose', this.choseAllPersons, this.choosePersons, this.chooseDeparts)
      },
      getChoosePersons: function (persons) {

      },
      getChooseDeparts: function (depart, persons) {

      }
    }
  }
</script>
<style scoped>
  .fixed_bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .margin-bottom50 {
    margin-bottom: 50px;
  }
</style>
