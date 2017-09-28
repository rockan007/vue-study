<template>
  <div>
    <router-view v-on:chosePersons="getChosePersons"
                 v-on:choseDeparts="getChoseDeparts"
                 v-bind:class="[{'margin-bottom50':isBottomMargin}]"></router-view>
    <div v-if="chosePersons.length>0" class="weui-flex fixed_bottom">
      <div class="weui-flex__item" v-on:click="routerToPub">
        <a class="weui-btn weui-btn_default">
          取消
        </a>
      </div>
      <div class="weui-flex__item" v-on:click="chooseDepartsPersons">
        <a class="weui-btn weui-btn_primary">
          确定({{choseSize}})
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import consts from '../mock-data/consts'
  import router from '../router/index'
  import storage from '../utils/storage'

  export default {
    name: 'choose-container',
    props: {},
    data: function () {
      return {
        chosePersons: storage.getSessionMap(consts.KEY_CHOOSE_PERSONS),
        choseDeparts: storage.getSessionMap(consts.KEY_CHOOSE_DEPARTS),
        choseSize: 0,
        chooseType: 0//0:人员选择 1：部门选择
      }
    },
    created: function () {
      console.log('choose-container当前路由的路由名称：' + this.$route.name)
      console.log('choose-container当前路由参数：' + JSON.stringify(this.$route.params))
      if (this.$route.name === 'depart-person') {
        this.chooseType = 0
      } else {
        this.chooseType = 1
      }
    },
    watch: {
      chosePersons: function (newVal, oldVal) {
        this.choseSize = newVal.size
      },
      choseDeparts: function (newVal, oldVal) {
        this.choseSize = newVal.size
      }
    },
    methods: {
      chooseDepartsPersons: function () {
        if (this.chooseType === 0) {
          this.$emit('chosePersons', this.chosePersons)
        } else {
          this.$emit('choseDeparts', this.choseDeparts)
        }
        this.routerToPub()
      },
      routerToPub: function () {
        let pos = this.getPosition()
        console.log('@@@@@com-persen@@@@@导向发布页面')
        router.go(-parseInt(pos))
      },
      getPosition: function () {
        let id = parseInt(this.$route.params.id)
        return storage.getSessionMapValue(consts.KEY_DEPART_POSITION, id)
      },
      getChosePersons: function (persons) {
        console.log('choose-container获取的已选人员Map：' + JSON.stringify(persons))
        this.chosePersons = persons
      },
      getChoseDeparts: function (departs) {
        console.log('choose-container获取的已选部门Map:' + JSON.stringify(departs))
        this.choseDeparts = departs
      },
      isBottomMargin: function () {
        if (this.chooseType === 0) {
          if (this.chosePersons.size > 0) {
            return true
          }
        } else {
          if (this.choseDeparts.size > 0) {
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
  }

  .margin-bottom50 {
    margin-bottom: 50px;
  }

  .weui-btn_primary {
    background-color: #46bdff;
  }

  .weui-btn_primary:not(.weui-btn_disabled):active {
    color: hsla(0, 0%, 100%, .6);
    background-color: #46bdff;
  }
</style>
