<template>
  <div class="weui-cells weui-cells_form">
  <div class="weui-cell">
    <div class="weui-cell__bd">
      <input class="weui-input" v-model.trim="title" type="text" placeholder="在此输入标题"/>
      </div>
    </div>
  <div v class="weui-cell">
    <div class="weui-cell_bd">
      <textarea rows="10" v-model.trim="description" class="weui-textarea" placeholder="在此输入正文"></textarea>
      </div>
    </div>
  <extra-file v-bind:msgType="msgType"></extra-file>
  <a class="weui-btn weui-btn_mini weui-btn_primary" v-on:click="finishMethod()">完成</a>
  <a class="weui-btn weui-btn_mini weui-btn_default" v-on:click="cancelMethod()">取消</a>
  </div>
</template>
<script>
  import extraFile from './extraFile.vue';
  export default {
    components: {extraFile},
    name:'extra-publish',
    props:{
      msgType:{
        type:Number,
        default:0
      }
    },
    data:function () {
      return {
        title:'',
        description:'',
        uploadReal:true
      }
    },
    created:function () {

    },
    computed:{

    },
    methods:{

    }
  }
</script>
