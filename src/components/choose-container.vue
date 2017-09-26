<template>
  <div>
    <router-view v-on:togglePerson="getTogglePersons"
                 v-bind:class="[{'margin-bottom50':chosePersons.length>0}]"></router-view>
    <div v-if="chosePersons.length>0" class="weui-flex fixed_bottom">
      <div class="weui-flex__item" v-on:click="routerToPub">
        <a class="weui-btn weui-btn_default">
          取消
        </a>
      </div>
      <div class="weui-flex__item" v-on:click="chooseDepartsPersons">
        <a class="weui-btn weui-btn_primary">
          确定({{chosePersons.length > 99 ? "99+" : chosePersons.length}})
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import consts from '../mock-data/consts'
  import events from '../utils/events'
  import router from '../router/index'

  export default {
    name: 'choose-container',
    props: {},
    data: function () {
      return {
        chosePersons: events.getSessionArray(consts.KEY_CHOOSE_PERSONS)
      }
    },
    methods: {
      chooseDepartsPersons: function () {
        this.$emit('chosePersons', this.chosePersons)
        this.routerToPub()
      },
      routerToPub: function () {
        let pos = this.getPosition()
        console.log('@@@@@com-persen@@@@@导向发布页面')
        router.go(-parseInt(pos))
      },
      getPosition: function () {
        let id = 1
        if (parseInt(this.$route.params.id) > 0) {
          id = parseInt(this.$route.params.id)
        }
        return events.getSessionMapValue(consts.KEY_DEPART_POSITION, id)
      },
      getTogglePersons: function (persons, isAdd) {
        console.log('000000#######choose-person.html######' + JSON.stringify(persons) + '是否添加' + isAdd)
        if (isAdd) {
          this.chosePersons = this.chosePersons.concat(persons)
        } else {
          this.delPerson(persons)
        }
        sessionStorage.setItem(consts.KEY_CHOOSE_PERSONS, JSON.stringify(this.chosePersons))
      },
      delPerson: function (persons) {
        let com = this
        this.chosePersons = this.chosePersons.filter(function (chosePerson) {
          return !com.isExistInDelPersons(chosePerson, persons)
        })
        console.log('删除人员后的值：' + JSON.stringify(this.chosePersons))
      },
      isExistInDelPersons: function (person, persons) {
        for (let i in persons) {
          if (persons[i].userid === person.userid) {
            return true
          }
        }
        return false
      },
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
