<template>
  <div>
    <div class="weui-cells">
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
            <label for class="weui-label">消息类型</label>
        </div>
        <div class="weui-cell__bd">
         <select class="weui-select" name="select" v-on:change="getType">
            <option   v-for="(msgStyle,index) in msgStyles" v-bind:selected="msgStyle.typeNo===msgType" v-bind:value="msgStyle.typeNo">{{msgStyle.typeName}}</option>
         </select>
        </div>
      </div>
      <div class="weui-cell weui-cell_access" v-on:click="routeToPersons">
          <div class="weui-cell__bd">
             人员选择
          </div>
          <div class="weui-cell__ft" >
            {{chosePersons.length>99?"99":chosePersons.length}}
          </div>
      </div>
    </div>
    <textarea v-if="msgType<1" v-model.trim.lazy="content" v-bind:rows=10 v-bind:style="{width:'100%'}"></textarea>
    <extra-file v-else v-bind:msgType="msgType"></extra-file>
    <a class="weui-btn weui-btn_primary" v-on:click="publishMethod">发布</a>
  </div>
</template>
<script>
  import '../assets/weui.min.css';
  import extraFile from './extraFile.vue';
  import consts from '../mock-data/consts';
  export default{
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type : Array,
        default:function () {
          return [];
        }
      },
      content:''
    },
    components: {
      extraFile
    },
    data: function () {
      return {
        msgType : 0,
        msgStyles:consts.MSGSTYLES
      }
    },
    created:function () {
      console.log("获取的类型数据："+JSON.stringify(consts.MSGSTYLES));
    },

    methods:{
      publishMethod: function () {

      },
      routeToPersons: function () {

      },
      getType: function (event) {
        console.log(event.target.value);
        this.msgType = parseInt(event.target.value);
      }

    }
  }
</script>
<style scoped>

</style>

