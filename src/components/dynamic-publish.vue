<template>
  <div>
  <div v-bind:class="['weui-cells']">
  <div v-bind:class="['weui-cell','weui-cell_select','weui-cell_select-after']">
    <div v-bind:class="['weui-cell__hd']">
      <label for v-bind:class="['weui-label']">消息类型</label>
      </div>
    <div v-bind:class="['weui-cell__bd']">
      <select v-bind:class="['weui-select']" name="select" v-on:change="getType($event)">
        <option   v-for="(msgStyle,index) in msgStyles" v-bind:selected="msgStyle.typeNo===msgType" v-bind:value="msgStyle.typeNo">{{msgStyle.typeName}}</option>
        </select>
      </div>
    </div>
  <div v-bind:class="['weui-cell','weui-cell_access']" v-on:click="routeToPersons">
    <div v-bind:class="['weui-cell__bd']">
      人员选择
      </div>
    <div v-bind:class="['weui-cell__ft']" >
      {{chosePersons.length>99?"99":chosePersons.length}}
      </div>
    </div>
  </div>
  <textarea v-if="msgType<1" v-model.trim.lazy="content" v-bind:rows=10 v-bind:style="{width:'100%'}"></textarea>
  <extra-file v-else ></extra-file>
  <a v-bind:class="['weui-btn','weui-btn_primary']" v-on:click="publishMethod">发布</a>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue';
 import '../mock-data/message-type';
  export default{
    name: 'dynamic-publish',
    props: {
      chosePersons: {
        type : Array
      },
      msgStyle:{
        type : Object
      },
      msgStyles:MSGSTYLES

    },
    components: {
      extraFile
    },
    data: function () {
      return {
        msgType : 0,
      }
    },
    created:function () {

    },
    methods:{
      publishMethod: function () {

      },
      routeToPersons: function () {

      },
      getType: function (event) {

      }

    }
  }
</script>
<style scoped>

</style>

