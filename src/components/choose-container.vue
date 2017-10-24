<template>
  <div>
    <router-view v-on:chosePersons="getChosePersons"
                 v-on:choseDeparts="getChoseDeparts"
                 v-bind:class="[{'margin-bottom50':isBottomMargin()}]"></router-view>
    <div v-if="isBottomMargin()" class="weui-flex fixed_bottom">
      <div class="weui-flex__item">
        <div class="bottom_button" style="float: right;" v-on:click="routerToPub">
          <a class="weui-btn weui-btn_default cancel">
            取消
          </a>
        </div>
      </div>
      <div style="width: 15px"></div>
      <div class="weui-flex__item">
        <div class="bottom_button" v-on:click="chooseDepartsPersons">
          <a class="weui-btn weui-btn_primary confirm">
            确定({{choseSize}})
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { consts } from '../mock-data/consts'
  import { storage } from '../utils/storage'

  export default {
    name: 'choose-container',
    props: {
      chosePersons: {
        type: Map,
        default: function () {
          return new Map()
        }
      },
      choseDeparts: {
        type: Map,
        default: function () {
          return new Map()
        }
      }
    },
    data: function () {
      return {
        selectedPersons: storage.getSessionMap(consts.KEY_CHOOSE_PERSONS),//选择的人员
        selectedDeparts: storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS),//选择的部门
        choseSize: 0,
        chooseType: 0//0:人员选择 1：部门选择
      }
    },
    created: function () {
      console.log('choose-container当前路由的路由名称：' + this.$route.name)
      console.log('choose-container当前路由参数：' + JSON.stringify(this.$route.params))
      if (this.$route.name === 'depart-person') {
        this.chooseType = 0
        this.choseSize = this.selectedPersons.size
      } else {
        this.chooseType = 1
        this.choseSize = this.selectedDeparts.size
      }
    },
    watch: {
      selectedPersons: function (newVal, oldVal) {
        this.choseSize = newVal.size
      },
      selectedDeparts: function (newVal, oldVal) {
        this.choseSize = newVal.size
      }
    },
    methods: {
      chooseDepartsPersons: function () {
        if (this.chooseType === 0) {
          this.$emit('chosePersons', this.selectedPersons)
        } else {
          this.$emit('choseDeparts', this.selectedDeparts)
        }
        this.routerToPub()
      },
      routerToPub: function () {
        let pos = this.$route.params.path.split('-').length
        console.log('@@@@@com-persen@@@@@导向发布页面position' + pos)
        this.$router.go(-parseInt(pos))
      },
      getChosePersons: function (persons) {
        console.log('choose-container获取的已选人员Map：' + JSON.stringify(persons))
        this.selectedPersons = persons
      },
      getChoseDeparts: function (departs) {
        console.log('choose-container获取的已选部门Map:' + JSON.stringify(departs))
        this.selectedDeparts = departs
      },
      isBottomMargin: function () {
        if (this.chooseType === 0) {
          if (this.chosePersons.size > 0) {
            return true
          }
          if (this.selectedPersons.size > 0) {
            return true
          }
        } else {
          if (this.choseDeparts.size > 0) {
            return true
          }
          if (this.selectedDeparts.size > 0) {
            return true
          }
        }
        return false
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
    background-color: white;
    z-index: 99;
    height: 55px;
    border-top: solid 1px #f2f2f2;
    padding-top: 7px;
  }

  .margin-bottom50 {
    margin-bottom: 55px;
  }

  .weui-btn_primary:not(.weui-btn_disabled):active {
    color: hsla(0, 0%, 100%, .6);
    background-color: #47bdff;
  }

  .weui-btn_default.cancel {
    background-color: #f2f2f2;
    border-color: #e4e4e4;
  }

  .weui-btn_primary.confirm {
    background-color: #47bdff;
  }

  .bottom_button {
    width: 155px;
    height: 40px;
  }
</style>
