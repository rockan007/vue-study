<template>
  <div>
    <router-view v-on:togglePerson="getTogglePersons" v-on:toggleDepart="getToggleDeparts"
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
  import consts from '../mock-data/consts'
  import events from '../utils/events'

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
      getTogglePersons: function (person, isAdd) {
        //放置在已选列表中
        console.log('放置数据前choosePersons：' + this.choosePersons)
        if ((isAdd && !this.choseAllPersons.has(person.userid)) || !isAdd) {
          this.choosePersons = events.toggleMapValue(this.choosePersons, person.userid, person.name, isAdd)
          events.setSessionSet(consts.KEY_CHOOSE_PERSONS, this.choosePersons)
        }
        console.log('放置数据后choosePersons：' + this.choosePersons)
        //放置在所有已选人员中
        console.log('放置数据前AllPersons：' + this.choseAllPersons)
        events.toggleValueInSet(this.choseAllPersons, person.userid, isAdd)
        events.setSessionSet(consts.KEY_ALL_CHOOSE_PERSON, this.choseAllPersons)
        console.log('放置数据后AllPersons：' + this.choseAllPersons)

      },
      getToggleDeparts: function (depart, persons, isAdd) {
        console.log('放置数据前chooseDeparts:' + this.chooseDeparts)
        events.toggleMapValue(this.chooseDeparts, depart.value, depart.title, isAdd)
        console.log('放置数据后chooseDeparts:' + this.chooseDeparts)
        console.log('放置数据前choseAllPersons' + this.choseAllPersons)
        for (let i in persons) {
          events.toggleValueInSet(this.choseAllPersons, persons[i].userid, isAdd)
        }
        events.setSessionSet(consts.KEY_ALL_CHOOSE_PERSON, this.choseAllPersons)
        console.log('放置数据后choseAllPersons' + this.choseAllPersons)
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
