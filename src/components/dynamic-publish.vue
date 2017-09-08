<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入通知标题"/>
        </div>
      </div>
      <div v class="weui-cell">
        <div class="weui-cell_bd">
          <textarea rows="10" v-model.trim="description" class="weui-textarea" placeholder="在此输入通知内容"></textarea>
          <extra-file v-bind:msgType="msgType"></extra-file>
        </div>
      </div>
      <div class="weui-cell weui-cell_access" v-on:click="routeToPersons">
        <div class="weui-cell__bd">
          通知人员选择
        </div>
        <div class="weui-cell__ft">
          {{chosePersons.length > 99 ? "99" : chosePersons.length}}
        </div>
      </div>
      <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">
          是否短信同步
        </div>
        <div class="weui-cell__ft">
          <input class="weui-switch" type="checkbox"/>
        </div>
      </div>
    </div>
    <a class="weui-btn weui-btn_primary" v-on:click="publishMethod">发布</a>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue'
  import consts from '../mock-data/consts';
  import router from '../router/index';

  export default {
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type: Array,
        default: function () {
          return []
        }
      },
      content: ''
    },
    components: {
      extraFile
    },
    data: function () {
      return {
        msgType:1,
        msgStyles: consts.MSGSTYLES,
        title: '',
        description: ''
      }
    },
    created: function () {
      console.log('获取的类型数据：' + JSON.stringify(consts.MSGSTYLES))
    },

    methods: {
      publishMethod: function () {

      },
      routeToPersons: function () {
        router.push({
          name:'choose-person',
          params:{
            id:-1
          }
        });
      },
      getType: function (event) {
        console.log(event.target.value)
        this.msgType = parseInt(event.target.value)
      }

    }
  }
</script>
<style scoped>

</style>

